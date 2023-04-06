import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text, HelperText, HelperTextItem } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export default {
  title: 'System registration',
  name: 'registration',
  nextStep: 'packages',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <Text>Use this to log into your system.</Text>,
    },
    {
      component: componentTypes.TEXT_FIELD,
      label: 'Username',
      placeholder: 'Enter username',
      helperText: (
        <HelperText>
          <HelperTextItem className="pf-u-mt-xs" variant="indeterminate">
            Can only contain letters, numbers, hyphens ( - ), and underscores( _
            ).
          </HelperTextItem>
        </HelperText>
      ),
      name: 'username',
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
          message:
            'Can only contain letters, numbers, hyphens ( - ), and underscores( _ ).',
        },
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
        { type: 'reservedUsernameValidator' },
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
