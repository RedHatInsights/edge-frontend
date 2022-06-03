import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  BellIcon,
  PauseCircleIcon,
  CircleNotchIcon,
  UnknownIcon,
} from '@patternfly/react-icons';

import dangerColor from '@patternfly/react-tokens/dist/esm/global_danger_color_100';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
import successColor from '@patternfly/react-tokens/dist/esm/global_success_color_100';
import infoColor from '@patternfly/react-tokens/dist/esm/global_info_color_100';

import React from 'react';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import otherInfoColor from '@patternfly/react-tokens/dist/esm/global_active_color_100';

export const statusMapper = [
  'done',
  'error',
  'pending',
  'unknown',
  'updating',
  'warning',
  'notification',
];

export const statusToIcon = {
  done: {
    icon: CheckCircleIcon,
    color: successColor.value,
    title: 'Fully adopted',
  },
  error: {
    icon: ExclamationCircleIcon,
    color: dangerColor.value,
    title: 'Error while adopting',
  },
  pending: { icon: PauseCircleIcon, title: 'Pending adoption' },
  updating: { icon: CircleNotchIcon, title: 'Updating' },
  unknown: { icon: UnknownIcon, title: 'Unknown state' },
  warning: {
    icon: ExclamationTriangleIcon,
    color: warningColor.value,
    title: 'Warning while adopting',
  },
  notification: {
    icon: BellIcon,
    color: infoColor.value,
    title: 'Delivering',
  },
};

export const sortByDirection = (data, direction = 'asc') =>
  data.sort((a, b) =>
    direction === 'asc'
      ? a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      : b.name.toLowerCase().localeCompare(a.name.toLowerCase())
  );

export const deviceSummaryMapper = [
  'active',
  'noReports',
  'neverReported',
  'orphaned',
];

export const imageDistributionMapper = {
  'rhel-8.1': 'RHEL 8.1',
  'rhel-8.2': 'RHEL 8.2',
  'rhel-8.3': 'RHEL 8.3',
};

export const composeStatus = [
  'CREATED',
  'BUILDING',
  'ERROR',
  'SUCCESS',
  'INTERRUPTED',
];

//For this object, it's need to sisable lint once this is not a react component
export const statusIcons = {
  // eslint-disable-next-line react/display-name
  unknown: (color) => <QuestionCircleIcon color={color} />,
  // eslint-disable-next-line react/display-name
  CREATED: (color) => <CheckCircleIcon color={color} />,
  // eslint-disable-next-line react/display-name
  BUILDING: (color) => <InProgressIcon color={color} />,
  // eslint-disable-next-line react/display-name
  ERROR: (color) => <TimesCircleIcon color={color} />,
  // eslint-disable-next-line react/display-name
  SUCCESS: (color) => <CheckCircleIcon color={color} />,
  // eslint-disable-next-line react/display-name
  INTERRUPTED: (color) => <InProgressIcon color={color} />,
};

export const statusColors = {
  unknown: 'grey',
  CREATED: 'green',
  BUILDING: otherInfoColor.value,
  ERROR: 'red',
  SUCCESS: 'green',
  INTERRUPTED: otherInfoColor.value,
};

export const imageStatusMapper = {
  CREATED: 'CREATED',
  BUILDING: 'Image build in progress',
  ERROR: 'ERROR',
  SUCCESS: 'Ready',
  INTERRUPTED: 'Image build in progress',
};

export const distributionMapper = {
  'rhel-84': 'RHEL 8.4',
  'rhel-85': 'RHEL 8.5',
  'rhel-86': 'RHEL 8.6',
  'rhel-90': 'RHEL 9.0',
};

export const releaseMapper = {
  'rhel-90': 'Red Hat Enterprise Linux (RHEL) 9.0',
  'rhel-86': 'Red Hat Enterprise Linux (RHEL) 8.6',
  'rhel-85': 'Red Hat Enterprise Linux (RHEL) 8.5',
  'rhel-84': 'Red Hat Enterprise Linux (RHEL) 8.4',
};

export const supportedReleases = ['rhel-84', 'rhel-85'];

export const temporaryReleases = ['rhel-84', 'rhel-85', 'rhel-86', 'rhel-90'];

export const DEFAULT_RELEASE = 'rhel-85';
export const TEMPORARY_RELEASE = 'rhel-90';

export const imageTypeMapper = {
  'rhel-edge-commit': 'RHEL for Edge Commit (.tar)',
  'rhel-edge-installer': 'RHEL for Edge Installer (.iso)',
};
