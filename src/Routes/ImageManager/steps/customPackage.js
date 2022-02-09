import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Text } from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

export default {
  title: 'Custom packages',
  name: 'customPackages',
  nextStep: 'packages',
  substepOf: 'Add content',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>
          Add packages from <a href=""> 3 custom repositories</a> to your
          <b>Red Hat Enterprise Linux (RHEL) 8.4</b> image.
        </Text>
      ),
    },
    {
      component: componentTypes.TEXTAREA,
      name: 'package-list',
      style: {
        paddingRight: '32px',
        height: '30vh',
      },
      label: <b> Packages </b>,
      helperText:
        'Specify individual packages by exact name and casing, with no whitespace. one entry to a line, and can include hyphens ( - ).',
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text className="pf-u-warning-color-100">
          <ExclamationTriangleIcon class="pf-u-warning-color-100" />
          &nbsp; Packages names that do not have exact name and casing will not
          be included in the image.
        </Text>
      ),
    },
  ],
};
