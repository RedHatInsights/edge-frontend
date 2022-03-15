import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import RepositoryTable from '../../Repositories/RepositoryTable';

const mockRepositories = [
  {
    id: 1,
    name: 'AWS repository',
    baseURL: 'rh.aws.com',
  },
];

export default {
  title: 'Custom repositories',
  name: 'repositories',
  nextStep: 'customPackages',
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
      component: componentTypes.PLAIN_TEXT,
      name: 'repository-table',
      label: <RepositoryTable data={mockRepositories} mode="selection" />,
    },
  ],
};
