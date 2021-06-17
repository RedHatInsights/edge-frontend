import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { releaseMapper } from '../../ImageManagerDetail/constants';

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
      options: Object.keys(releaseMapper).map((release) => ({
        value: release,
        label: releaseMapper[release],
      })),
      initialValue: 'rhel-8.3',
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
      isDisabled: true,
    },
    {
      component: componentTypes.SELECT,
      name: 'outputType',
      label: 'Output Type',
      options: [
        { value: 'rhel-edge-iso', label: 'RHEL for Edge Installer (.iso)' },
      ],
      initialValue: 'rhel-edge-iso',
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
      isDisabled: true,
    },
  ],
};
