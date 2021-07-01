import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { TextContent, Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

export default {
  title: 'Device Registration',
  name: 'registration',
  nextStep: 'packages',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <Text>Use this to connect your device to Fleet Management.</Text>,
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'username',
      helperText: (
        <TextContent>
          <Text>
            <strong>Username</strong>
          </Text>
          <Text>
            Use the default <Text component={'b'}>root</Text> username to log in
            and register your device.
          </Text>
        </TextContent>
      ),
      initialValue: 'root',
      hidden: true,
    },
    {
      component: 'ssh-input-field',
      name: 'credentials',
      validate: [
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^(ssh-(rsa|dss)|ecdsa-sha2-nistp(256|384|521)) \S+/,
        },
      ],
      isRequired: true,
    },
  ],
};
