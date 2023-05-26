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
  additionalCustomPackages,
} from './steps';
import { Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ReviewStep from '../../components/form/ReviewStep';
import { useDispatch } from 'react-redux';
import { createImage } from '../../api/images';
import { useFeatureFlags } from '../../utils';
import apiWithToast from '../../utils/apiWithToast';
import { DEFAULT_RELEASE, TEMPORARY_RELEASE } from '../../constants';

const CreateImage = ({ navigateBack, reload, notificationProp }) => {
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const temporaryReleasesFlag = useFeatureFlags(
    'fleet-management.temporary-releases'
  );

  const imageWizardFeatureFlag = useFeatureFlags(
    'edge-management.image_wizard_ui'
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

  const statusMessages = {
    onSuccess: {
      title: 'Success',
      description: `Successfully created image`,
    },
    onError: { title: 'Error', description: 'Failed to create image' },
  };

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
        apiWithToast(dispatch, () => createImage(payload), statusMessages, notificationProp);
        closeAction();
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
              repositories(imageWizardFeatureFlag),
              packages,
              review,
              customPackages,
              additionalCustomPackages,
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
  notificationProp: PropTypes.object,
};
CreateImage.defaultProps = {
  navigateBack: () => undefined,
};

export default CreateImage;
