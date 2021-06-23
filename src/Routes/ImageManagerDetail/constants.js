import React from 'react';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import PendingIcon from '@patternfly/react-icons/dist/js/icons/pending-icon';
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/question-circle-icon';

export const composeStatus = ['CREATED', 'BUILDING', 'ERROR', 'SUCCESS'];

export const statusIcons = {
  unknown: <QuestionCircleIcon />,
  CREATED: <CheckCircleIcon />,
  BUILDING: <PendingIcon />,
  ERROR: <TimesCircleIcon />,
  SUCCESS: <CheckCircleIcon />,
};

export const statusColors = {
  unknown: 'grey',
  CREATED: 'green',
  BUILDING: 'cyan',
  ERROR: 'red',
  SUCCESS: 'green',
};

export const releaseMapper = {
  'rhel-8': 'Red Hat Enterprise Linux (RHEL) 8.3',
};

export const imageTypeMapper = {
  'rhel-edge-installer': 'RHEL for Edge Installer (.iso)',
  'rhel-edge-commit': 'RHEL for Edge Commit (.tar)',
};
