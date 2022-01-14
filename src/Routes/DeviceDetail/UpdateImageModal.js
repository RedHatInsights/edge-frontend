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
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import {
  distributionMapper,
  imageTypeMapper,
  releaseMapper,
} from '../ImageManagerDetail/constants';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useSelector, shallowEqual } from 'react-redux';
import { RegistryContext } from '../../store';
import { imageDetailReducer } from '../../store/reducers';
import { loadImageDetail, loadEdgeImageSets } from '../../store/actions';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const UpdateImageModal = ({
  updateCveModal,
  setUpdateCveModal,
  refreshTable,
}) => {
  const dispatch = useDispatch();
  console.log(updateCveModal);

  const { getRegistry } = useContext(RegistryContext);
  const { data } = useSelector(
    ({ imageDetailReducer }) => ({
      data: imageDetailReducer?.data || null,
    }),
    shallowEqual
  );

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    const registered = getRegistry().register({
      imageDetailReducer,
    });
    updateCveModal?.imageId &&
      loadImageDetail(dispatch, updateCveModal?.imageId);
    return () => registered();
  }, [dispatch]);

  const handleUpdateModal = async () => {
    const payload = {
      ...data.image,
      Version: data?.image?.Version + 1,
    };
    console.log(payload);
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
  refreshTable: PropTypes.func,
  updateModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    deviceData: PropTypes.object.isRequired,
  }).isRequired,
  setUpdateModal: PropTypes.func.isRequired,
};

export default UpdateImageModal;
