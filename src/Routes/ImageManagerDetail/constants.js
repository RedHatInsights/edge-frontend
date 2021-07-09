import React from 'react';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/question-circle-icon';

export const composeStatus = ['CREATED', 'BUILDING', 'ERROR', 'SUCCESS'];

export const statusIcons = {
  unknown: color => <QuestionCircleIcon color={color}/>,
  CREATED: color => <CheckCircleIcon color={color} />,
  BUILDING: color => <InProgressIcon color={color} />,
  ERROR: color => <TimesCircleIcon color={color} />,
  SUCCESS: color => <CheckCircleIcon color={color}/>,
};

export const statusColors = {
  unknown: 'grey',
  CREATED: 'green',
  BUILDING: 'blue',
  ERROR: 'red',
  SUCCESS: 'green',
};

export const imageStatusMapper = {
  CREATED: 'CREATED',
  BUILDING: 'Image build in progress',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
};

export const releaseMapper = {
  'rhel-84': 'Red Hat Enterprise Linux (RHEL) 8.4',
};

export const imageTypeMapper = {
  'rhel-edge-installer': 'RHEL for Edge Installer (.iso)',
  'rhel-edge-commit': 'RHEL for Edge Commit (.tar)',
};

