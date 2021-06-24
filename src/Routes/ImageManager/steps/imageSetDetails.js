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
      name: 'image-name',
      label: 'Image Name',
      placeholder: 'Image Name',
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'description',
      label: 'Description',
      placeholder: 'Add Description',
    },
  ],
};
