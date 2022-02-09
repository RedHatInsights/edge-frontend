import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
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
  nextStep: 'packages',
  substepOf: 'Add content',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'repository-table',
      label: <RepositoryTable data={mockRepositories} mode="selection" />,
    },
  ],
};
