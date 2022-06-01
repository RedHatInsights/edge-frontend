import React, { useEffect, useContext } from 'react';
import {
  Modal,
  Button,
  Text,
  TextContent,
  TextListItem,
  TextList,
  TextVariants,
  TextListVariants,
  TextListItemVariants,
  Backdrop,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import { imageTypeMapper, releaseMapper } from '../../constants';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSelector, shallowEqual } from 'react-redux';
import { RegistryContext } from '../../store';
import { imageDetailReducer } from '../../store/reducers';
import { loadImageDetail, loadEdgeImageSets } from '../../store/actions';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { createNewImage, addImageToPoll } from '../../store/actions';
import { getEdgeImageStatus } from '../../api/images';

const UpdateImageModal = ({ updateCveModal, setUpdateCveModal, setReload }) => {
  const dispatch = useDispatch();

  const { getRegistry } = useContext(RegistryContext);
  const { data } = useSelector(
    ({ imageDetailReducer }) => ({
      data: imageDetailReducer?.data || null,
    }),
    shallowEqual
  );

  useEffect(() => {
    const registered = getRegistry().register({
      imageDetailReducer,
    });
    updateCveModal?.imageId &&
      loadImageDetail(dispatch, updateCveModal?.imageId);
    return () => registered();
  }, [dispatch]);

  const handleUpdateModal = () => {
    const payload = {
      Id: data?.image?.ID,
      description: data?.image?.Description,
      name: data?.image?.Name,
      version: data?.image?.Version + 1,
      architecture: 'x86_64',
      credentials: data?.image?.Installer.SshKey,
      username: data?.image?.Installer.Username,
      imageType: data?.image?.OutputTypes,
      'selected-packages': data?.image?.Packages?.map((pack) => ({
        name: pack.Name,
      })),
      release: data?.image?.Distribution,
    };
    handleClose();
    setReload(true);
    createNewImage(dispatch, payload, (resp) => {
      dispatch({
        ...addNotification({
          variant: 'info',
          title: 'Update image',
          description: `${resp.value.Name} image was added to the queue.`,
        }),
        meta: {
          polling: {
            id: `FETCH_IMAGE_${resp.value.ID}_BUILD_STATUS`,
            fetcher: () => getEdgeImageStatus(resp.value.ID),
            condition: (resp) => {
              switch (resp.Status) {
                case 'BUILDING':
                  return [true, ''];
                case 'ERROR':
                  return [false, 'failure'];
                default:
                  return [false, 'success'];
              }
            },
            onEvent: {
              failure: [
                (dispatch) =>
                  dispatch(
                    addNotification({
                      variant: 'danger',
                      title: 'Image build failed',
                      description: `${resp.value.Name} image build is completed unsuccessfully`,
                    })
                  ),
              ],
              success: [
                (dispatch) =>
                  dispatch(
                    addNotification({
                      variant: 'success',
                      title: 'Image is ready',
                      description: `${resp.value.Name} image build is completed`,
                    })
                  ),
                (dispatch) => loadEdgeImageSets(dispatch),
              ],
            },
          },
        },
      });
      loadEdgeImageSets(dispatch);
      dispatch(
        addImageToPoll({ name: data?.image?.Name, id: data?.image?.ID })
      );
    });
  };

  const handleClose = () => {
    setUpdateCveModal((prevState) => ({ ...prevState, isOpen: false }));
  };

  return data ? (
    <Modal
      variant="medium"
      title={`Update image: ${data?.image?.Name}`}
      description="Review the information and click Create image to start the build process"
      isOpen={updateCveModal.isOpen}
      onClose={handleClose}
      //onSubmit={handleUpdateModal}
      actions={[
        <Button key="confirm" variant="primary" onClick={handleUpdateModal}>
          Create Image
        </Button>,
        <Button key="cancel" variant="link" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    >
      <TextContent>
        <TextListItem component={TextVariants.h3}>
          <Text component={'b'}>Details</Text>
        </TextListItem>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>Name</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {data?.image?.Name}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Version
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {data?.image?.Version + 1}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Description
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {data?.image?.Description}
          </TextListItem>
        </TextList>
        <TextListItem component={TextVariants.h3}>
          <Text component={'b'}>Output</Text>
        </TextListItem>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            Release
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {releaseMapper[data?.image?.Distribution]}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Output type
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {imageTypeMapper[data?.image?.ImageType]}
          </TextListItem>
        </TextList>
        <TextListItem component={TextVariants.h3}>
          <Text component={'b'}>Packages</Text>
        </TextListItem>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            Updated
          </TextListItem>
          <TextListItem
            className="pf-u-pl-lg"
            component={TextListItemVariants.dd}
          >
            {updateCveModal?.cveCount}
          </TextListItem>
        </TextList>
      </TextContent>
    </Modal>
  ) : (
    <Backdrop>
      <Bullseye>
        <Spinner isSVG diameter="100px" />
      </Bullseye>
    </Backdrop>
  );
};

UpdateImageModal.propTypes = {
  updateCveModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    imageId: PropTypes.string,
    cveCount: PropTypes.number,
  }).isRequired,
  setUpdateCveModal: PropTypes.func.isRequired,
  setReload: PropTypes.bool,
};

export default UpdateImageModal;
