import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { checkImageName } from '../../../api';
const helperText =
  'Can only contain letters, numbers, spaces, hyphens(-), and underscores(_).';

const asyncImageNameValidation = (value) =>
  checkImageName(value)
    .then((result) => {
      if (result.ImageExists) {
        throw new Error('Name already exists');
      }
    })
    .catch(({ message }) => {
      throw message;
    });

export default {
  title: 'Details',
  name: 'imageSetDetails',
  nextStep: 'imageOutput',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>
          Enter a name and description to easily identify your image later.
        </Text>
      ),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      label: 'Image name',
      placeholder: 'Image name',
      helperText: helperText,
      validate: [
        asyncImageNameValidation,
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-\s]*$/,
          message: helperText,
        },
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
      ],
      isRequired: true,
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'description',
      label: 'Description',
      placeholder: 'Add description',

      resizeOrientation: 'vertical',
      validate: [{ type: validatorTypes.MAX_LENGTH, threshold: 250 }],
    },
  ],
};
