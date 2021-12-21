import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import {
  imageTypeMapper,
  releaseMapper,
  DEFAULT_RELEASE,
} from '../../ImageManagerDetail/constants';

export default {
  title: 'Options',
  name: 'imageOutput',
  nextStep: ({ values }) =>
    values?.imageType?.includes('rhel-edge-installer') || !values.imageType
      ? 'registration'
      : 'packages',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <Text>Enter some basic information about your image.</Text>,
    },
    {
      component: componentTypes.SELECT,
      name: 'release',
      label: 'Release',
      options: Object.entries(releaseMapper).map(([release, releaseLabel]) => ({
        value: release,
        label: releaseLabel,
      })),
      initialValue: DEFAULT_RELEASE,
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
    },
    {
      component: 'image-output-checkbox',
      name: 'imageType',
      options: Object.entries(imageTypeMapper).map(
        ([imageType, imageTypeLabel]) => ({
          value: imageType,
          label: imageTypeLabel,
        })
      ),
      initialValue: ['rhel-edge-installer', 'rhel-edge-commit'],
      clearedValue: [],
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
};
