import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import RepositoryTable from '../../Repositories/RepositoryTable';
import { Text } from '@patternfly/react-core';
import { getCustomRepositories } from '../../../api';

export default async () => {
  const repos = await getCustomRepositories();
  const data = repos.data.map((repo) => ({
    id: repo.ID,
    name: repo.Name,
    baseURL: repo.URL,
    ...repo,
  }));

  return {
    title: 'Custom repositories',
    name: 'repositories',
    nextStep: 'packages',
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
        label: <RepositoryTable data={data} mode="selection" />,
      },
    ],
  };
};
