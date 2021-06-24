import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import {
  imageTypeMapper,
  releaseMapper,
} from '../../ImageManagerDetail/constants';

export default {
  title: 'Image Output',
  name: 'imageOutput',
  nextStep: 'registration',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>Enter some basic info about the image you are creating</Text>
      ),
    },
    {
      component: componentTypes.SELECT,
      name: 'release',
      label: 'Release',
      options: Object.entries(releaseMapper).map(([release, releaseLabel]) => ({
        value: release,
        label: releaseLabel,
      })),
      initialValue: 'rhel-8',
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
      isDisabled: true,
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'imageType',
      label: 'Output Type',
      options: Object.entries(imageTypeMapper).map(
        ([imageType, imageTypeLabel]) => ({
          value: imageType,
          label: imageTypeLabel,
        })
      ),
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
    },
  ],
};
