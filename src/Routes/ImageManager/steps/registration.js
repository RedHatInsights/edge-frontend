import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export default {
  title: 'Registration',
  name: 'registration',
  nextStep: 'packages',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>
          A user is required to register the device and make it visible on
          cloud.redhat.com
        </Text>
      ),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'username',
      label: 'Username',
      placeholder: 'Enter username',
      helperText:
        'The user name can only consist of letters from a-z, digits, dots, dashes and underscores.',
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
        },
        { type: validatorTypes.MIN_LENGTH, threshold: 5 },
      ],
      isRequired: true,
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'credentials',
      label: 'SSH Key',
      helperText:
        'Paste your public SSH key here',
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
      resizeOrientation: 'vertical',
    },
  ],
};
