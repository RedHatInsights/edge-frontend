import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text, TextContent } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { releaseMapper } from '../../ImageManagerDetail/constants';

const PackagesLabel = () => {
  const { getState } = useFormApi();
  const release = getState()?.values?.release;
  const releaseName = release !== undefined ? releaseMapper[release] : '';
  return (
    <TextContent>
      <Text>
        Add packages to your <Text component="b">{releaseName}</Text> image.
      </Text>
    </TextContent>
  );
};

export default {
  title: 'Additional Packages',
  name: 'packages',
  nextStep: 'review',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'google-cloud-text-component',
      label: <PackagesLabel />,
    },
    {
      component: 'package-selector',
      name: 'selected-packages',
      label: 'Available options',
    },
  ],
};
