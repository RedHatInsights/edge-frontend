import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export default {
  title: 'Device registration',
  name: 'registration',
  nextStep: 'packages',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <Text>Use this to log into your device.</Text>,
    },
    {
      component: componentTypes.TEXT_FIELD,
      label: 'Username',
      placeholder: 'Enter username',
      name: 'username',
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
        },
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
      ],
      isRequired: true,
    },
    {
      component: 'ssh-input-field',
      name: 'credentials',
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^(ssh-(rsa|dss|ed25519)|ecdsa-sha2-nistp(256|384|521)) \S+/,
        },
      ],
      isRequired: true,
    },
  ],
};
