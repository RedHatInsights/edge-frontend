import React, { useState, useEffect } from 'react';
import ImageCreator from '../../components/ImageCreator';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import {
  registration,
  review,
  packages,
  repositories,
  getImageSetDetailsSchema,
  imageOutput,
  customPackages,
} from './steps';
import { Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ReviewStep from '../../components/form/ReviewStep';
import { createNewImage } from '../../store/actions';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { getEdgeImageStatus } from '../../api/images';
import { useFeatureFlags } from '../../utils';
import { DEFAULT_RELEASE, TEMPORARY_RELEASE } from '../../constants';

const CreateImage = ({ navigateBack, reload }) => {
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const temporaryReleasesFlag = useFeatureFlags(
    'fleet-management.temporary-releases'
  );

  const closeAction = () => {
    navigateBack();
    reload && reload();
  };

  useEffect(() => {
    (async () => {
      insights?.chrome?.auth
        ?.getUser()
        .then((result) => setUser(result != undefined ? result : {}));
    })();
  }, []);

  // Re-initialize imageSetDetails schema each render, to avoid cache
  // of async validator results across multiple instances of the form.
  const imageSetDetails = getImageSetDetailsSchema();

  return user ? (
    <ImageCreator
      onClose={closeAction}
      customComponentMapper={{
        review: ReviewStep,
      }}
      onSubmit={({ values, setIsSaving }) => {
        setIsSaving(() => true);
        const payload = {
          ...values,
          architecture: 'x86_64',
        };
        createNewImage(dispatch, payload, (resp) => {
          dispatch({
            ...addNotification({
              variant: 'info',
              title: 'Creating image',
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
                  ],
                },
              },
            },
          });
          closeAction();
        });
      }}
      defaultArch="x86_64"
      initialValues={{
        version: 0,
        release: temporaryReleasesFlag ? TEMPORARY_RELEASE : DEFAULT_RELEASE,
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
            title: 'Create image',
            crossroads: [
              'release',
              'imageType',
              'third-party-repositories',
              'imageOutput',
            ],
            // order in this array does not reflect order in wizard nav, this order is managed inside
            // of each step by `nextStep` property!
            fields: [
              imageSetDetails,
              imageOutput,
              registration,
              repositories,
              packages,
              review,
              customPackages,
            ],
          },
        ],
      }}
    />
  ) : (
    <Spinner />
  );
};

CreateImage.propTypes = {
  navigateBack: PropTypes.func,
  reload: PropTypes.func,
};
CreateImage.defaultProps = {
  navigateBack: () => undefined,
};

export default CreateImage;
