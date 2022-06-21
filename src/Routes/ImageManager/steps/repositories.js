import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import WizardRepositoryTable from '../../../components/form/WizardRepositoryTable';

export default {
  title: 'Custom repositories',
  name: 'repositories',
  nextStep: ({ values }) =>
    values?.['third-party-repositories']?.length > 0 ||
    values?.['show-custom-packages'] ||
    values?.['initial-custom-repositories']?.length > 0
      ? 'customPackages'
      : 'packages',

  substepOf: 'Add content',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>
          Choose from linked custom repositories from which to search and add
          packages to this image.
        </Text>
      ),
    },
    {
      component: 'custom-repo-table',
      name: 'third-party-repositories',
      label: <WizardRepositoryTable />,
      initialValue: [],
      clearedValue: [],
    },
  ],
};
