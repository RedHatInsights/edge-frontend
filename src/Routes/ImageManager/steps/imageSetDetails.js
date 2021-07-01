import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export default {
  title: 'Image Set Details',
  name: 'imageSetDetails',
  nextStep: 'imageOutput',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>
          How would you like to identify this image later? What will it be used
          for?
        </Text>
      ),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      label: 'Image Name',
      placeholder: 'Image Name',
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-\s]*$/,
        },
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
      ],
      isRequired: true,
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      label: 'Description',
      placeholder: 'Add Description',
      resizeOrientation: 'vertical',
      validate: [{ type: validatorTypes.MAX_LENGTH, threshold: 250 }],
    },
  ],
};
