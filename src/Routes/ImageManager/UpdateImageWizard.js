import React, { useState, useEffect, useContext } from 'react';
import ImageCreator from '../../components/ImageCreator';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import {
  review,
  packages,
  updateDetails,
  registration,
  imageOutput,
} from './steps';
import { Bullseye, Backdrop, Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ReviewStep from '../../components/form/ReviewStep';
import {
  createNewImage,
  addImageToPoll,
  loadEdgeImages,
} from '../../store/actions';
import { CREATE_NEW_IMAGE_RESET } from '../../store/action-types';
import { useDispatch } from 'react-redux';
import { useSelector, shallowEqual } from 'react-redux';
import { RegistryContext } from '../../store';
import { imageDetailReducer } from '../../store/reducers';
import { loadImageDetail, loadEdgeImageSets } from '../../store/actions';
import { getEdgeImageStatus } from '../../api';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const UpdateImage = ({ navigateBack, updateImageID }) => {
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const closeAction = () => {
    navigateBack();
    dispatch({ type: CREATE_NEW_IMAGE_RESET });
  };

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
    updateImageID && loadImageDetail(dispatch, updateImageID);
    return () => registered();
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      const userData = (await insights?.chrome?.auth?.getUser()) || {};
      setUser(() => userData);
    })();
  }, []);

  return user && data ? (
    <ImageCreator
      onClose={closeAction}
      customComponentMapper={{
        review: ReviewStep,
      }}
      onSubmit={({ values, setIsSaving }) => {
        setIsSaving(() => true);
        const payload = {
          ...values,
          Id: data?.image?.ID,
          name: data?.image?.Name,
          version: data?.image?.Version + 1,
          architecture: 'x86_64',
          credentials: values.credentials
            ? values.credentials
            : data?.image?.Installer.SshKey,
          username: values.username
            ? values.username
            : data?.image?.Installer.Username,
        };

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
          closeAction();
          loadEdgeImageSets(dispatch);
          dispatch(
            addImageToPoll({ name: data.value.Name, id: data.value.ID })
          );
        });
      }}
      defaultArch="x86_64"
      initialValues={{
        name: data?.image?.Name,
        isUpdate: true,
        description: data?.image?.Description,
        credentials: data?.image?.Installer.SshKey,
        username: data?.image?.Installer.Username,
        version: data?.image?.Version,
        release: data?.image?.Distribution,
        imageType: ['rhel-edge-commit'],
        'selected-packages': data?.image?.Packages.map((pkg) => ({
          ...pkg,
          name: pkg.Name,
        })),
      }}
      schema={{
        fields: [
          {
            component: componentTypes.WIZARD,
            name: 'image-builder-wizard',
            className: 'image-builder',
            isDynamic: true,
            inModal: true,
            buttonLabels: {
              submit: 'Create image',
            },
            showTitles: true,
            title: `Update image: ${data?.image?.Name}`,
            crossroads: ['target-environment', 'release', 'imageType'],
            // order in this array does not reflect order in wizard nav, this order is managed inside
            // of each step by `nextStep` property!
            fields: [
              updateDetails,
              imageOutput,
              registration,
              packages,
              review,
            ],
          },
        ],
      }}
    />
  ) : (
    <Backdrop>
      <Bullseye>
        <Spinner isSVG diameter="100px" />
      </Bullseye>
    </Backdrop>
  );
};

UpdateImage.propTypes = {
  navigateBack: PropTypes.func,
  updateImageID: PropTypes.number,
};
UpdateImage.defaultProps = {
  navigateBack: () => undefined,
};

export default UpdateImage;
