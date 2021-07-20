import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export default {
  title: 'Image details',
  name: 'imageSetDetails',
  nextStep: 'imageOutput',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>Add a description to easily identify your image later.</Text>
      ),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'description',
      label: 'Description',
      placeholder: 'Add description',
      validate: [{ type: validatorTypes.MAX_LENGTH, threshold: 250 }],
    },
  ],
};
