import React, { useState, useEffect } from 'react';
import ImageCreator from '../../components/ImageCreator';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import {
  review,
  packages,
  updateDetails,
  registration,
  activationKey,
  repositories,
  imageOutput,
  customPackages,
  additionalCustomPackages,
} from './steps';
import { Bullseye, Backdrop, Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import ReviewStep from '../../components/form/ReviewStep';
import { useDispatch } from 'react-redux';
import { getImageById, createImage } from '../../api/images';
import { useFeatureFlags, getReleases } from '../../utils';
import apiWithToast from '../../utils/apiWithToast';

import { temporaryReleases, supportedReleases } from '../../constants';
import useApi from '../../hooks/useApi';

const UpdateImage = ({
  navigateBack,
  updateImageID,
  reload,
  notificationProp,
  locationProp,
}) => {
  const [user, setUser] = useState();
  const dispatch = useDispatch();
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

  const [response] = useApi({
    api: getImageById,
    id: updateImageID,
  });

  const { data, isLoading } = response;

  const temporaryReleasesFlag = useFeatureFlags(
    'fleet-management.temporary-releases'
  );

  const imageWizardFeatureFlag = useFeatureFlags(
    'edge-management.image_wizard_ui'
  );

  const statusMessages = {
    onSuccess: {
      title: `Successfully started image update`,
    },
    onError: { title: 'Error', description: 'Failed to create image' },
  };

  return user && data && !isLoading ? (
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

        apiWithToast(
          dispatch,
          () => createImage(payload),
          statusMessages,
          notificationProp
        );
        closeAction();
      }}
      defaultArch="x86_64"
      initialValues={{
        imageID: data?.image.ID,
        name: data?.image?.Name,
        isUpdate: true,
        description: data?.image?.Description,
        credentials: data?.image?.Installer.SshKey,
        username: data?.image?.Installer.Username,
        version: data?.image?.Version,
        activationKey: data?.image?.activationKey,
        release: data?.image?.Distribution,
        release_options: temporaryReleasesFlag
          ? getReleases(data?.image?.Distribution, [
              ...supportedReleases,
              ...temporaryReleases,
            ])
          : getReleases(data?.image?.Distribution),
        imageType: ['rhel-edge-commit'],
        'selected-packages': data?.image?.Packages?.map((pkg) => ({
          ...pkg,
          name: pkg.Name,
        })),
        'third-party-repositories': data?.image?.ThirdPartyRepositories?.map(
          (repo) => ({
            id: repo.ID,
            name: repo.Name,
            ...repo,
          })
        ),
        'initial-custom-repositories': data?.image?.ThirdPartyRepositories?.map(
          (repo) => ({
            id: repo.ID,
            name: repo.Name,
            ...repo,
          })
        ),
        'custom-packages': data?.image?.CustomPackages?.map((pkg) => ({
          ...pkg,
          name: pkg.Name,
        })),
      }}
      test=""
      schema={{
        fields: [
          {
            component: componentTypes.WIZARD,
            name: 'image-builder-wizard',
            className: 'image-builder',
            isDynamic: true,
            inModal: true,
            buttonLabels: {
              submit: 'Update image',
            },
            showTitles: true,
            title: `Update image: ${data?.image?.Name}`,
            crossroads: [
              'target-environment',
              'release',
              'imageType',
              'third-party-repositories',
            ],
            // order in this array does not reflect order in wizard nav, this order is managed inside
            // of each step by `nextStep` property!
            fields: [
              updateDetails,
              imageOutput,
              registration,
              repositories(imageWizardFeatureFlag, locationProp),
              packages,
              additionalCustomPackages,
              review,
              customPackages,
              activationKey,
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
  reload: PropTypes.func,
  notificationProp: PropTypes.object,
  locationProp: PropTypes.object,
};
UpdateImage.defaultProps = {
  navigateBack: () => undefined,
};

export default UpdateImage;
