import React from 'react';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import PendingIcon from '@patternfly/react-icons/dist/js/icons/pending-icon';
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/question-circle-icon';

export const composeStatus = [
  'success',
  'failure',
  'pending',
  'building',
  'uploading',
  'registering',
];

export const statusIcons = {
  unknown: <QuestionCircleIcon />,
  success: <CheckCircleIcon />,
  failure: <TimesCircleIcon />,
  pending: <PendingIcon />,
  building: <PendingIcon />,
  uploading: <PendingIcon />,
  registering: <PendingIcon />,
};

export const statusColors = {
  unknown: 'grey',
  success: 'green',
  failure: 'red',
  pending: 'cyan',
  building: 'cyan',
  uploading: 'cyan',
  registering: 'cyan',
};
