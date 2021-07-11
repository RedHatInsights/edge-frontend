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
  title: 'Image output',
  name: 'imageOutput',
  nextStep: 'registration',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <Text>Enter some basic information for your image.</Text>,
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
      isDisabled: true,
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
      initialValue: ['rhel-edge-installer'],
      clearedValue: [],
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
};
