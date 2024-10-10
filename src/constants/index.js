import {
  BellIcon,
  CheckCircleIcon,
  CircleNotchIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  PauseCircleIcon,
  PlusCircleIcon,
  UnknownIcon,
  RepositoryIcon,
  SearchIcon,
  ModuleIcon,
  CubeIcon,
  TimesCircleIcon,
  InProgressIcon,
  QuestionCircleIcon,
} from '@patternfly/react-icons';

import dangerColor from '@patternfly/react-tokens/dist/js/global_danger_color_100';
import warningColor from '@patternfly/react-tokens/dist/js/global_warning_color_100';
import successColor from '@patternfly/react-tokens/dist/js/global_success_color_100';
import infoColor from '@patternfly/react-tokens/dist/js/global_info_color_100';
import activeColor from '@patternfly/react-tokens/dist/js/global_active_color_100';

export const statusMapper = [
  'done',
  'error',
  'pending',
  'unknown',
  'updating',
  'warning',
  'notification',
];

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

export const distributionMapper = {
  'rhel-84': 'RHEL 8.4',
  'rhel-85': 'RHEL 8.5',
  'rhel-86': 'RHEL 8.6',
  'rhel-87': 'RHEL 8.7',
  'rhel-88': 'RHEL 8.8',
  'rhel-89': 'RHEL 8.9',
  'rhel-90': 'RHEL 9.0',
  'rhel-91': 'RHEL 9.1',
  'rhel-92': 'RHEL 9.2',
  'rhel-93': 'RHEL 9.3',
  'rhel-94': 'RHEL 9.4',
};

export const releaseMapper = {
  'rhel-94': 'Red Hat Enterprise Linux (RHEL) 9.4',
  'rhel-93': 'Red Hat Enterprise Linux (RHEL) 9.3',
  'rhel-92': 'Red Hat Enterprise Linux (RHEL) 9.2',
  'rhel-91': 'Red Hat Enterprise Linux (RHEL) 9.1',
  'rhel-90': 'Red Hat Enterprise Linux (RHEL) 9.0',
  'rhel-8.10': 'Red Hat Enterprise Linux (RHEL) 8.10',
  'rhel-89': 'Red Hat Enterprise Linux (RHEL) 8.9',
  'rhel-88': 'Red Hat Enterprise Linux (RHEL) 8.8',
  'rhel-87': 'Red Hat Enterprise Linux (RHEL) 8.7',
  'rhel-86': 'Red Hat Enterprise Linux (RHEL) 8.6',
  'rhel-85': 'Red Hat Enterprise Linux (RHEL) 8.5',
  'rhel-84': 'Red Hat Enterprise Linux (RHEL) 8.4',
};

export const supportedReleases = [
  'rhel-84',
  'rhel-85',
  'rhel-86',
  'rhel-87',
  'rhel-88',
  'rhel-89',
  'rhel-8.10',
  'rhel-90',
  'rhel-91',
  'rhel-92',
  'rhel-93',
  'rhel-94',
];

export const temporaryReleases = ['rhel-93'];

export const DEFAULT_RELEASE = 'rhel-93';
export const TEMPORARY_RELEASE = 'rhel-93';

export const imageTypeMapper = {
  'rhel-edge-commit': 'RHEL for Edge Commit (.tar)',
  'rhel-edge-installer': 'RHEL for Edge Installer (.iso)',
};

export const iconMapper = {
  unknown: UnknownIcon,
  repository: RepositoryIcon,
  search: SearchIcon,
  module: ModuleIcon,
  cube: CubeIcon,
  question: QuestionCircleIcon,
  plus: PlusCircleIcon,
  checkCircle: CheckCircleIcon,
  exclamationTriangle: ExclamationTriangleIcon,
  timesCircle: TimesCircleIcon,
  inProgress: InProgressIcon,
  exclamationCircle: ExclamationCircleIcon,
};

export const colorMapper = {
  green: successColor.value,
  yellow: warningColor.value,
  lightBlue: infoColor.value,
  blue: activeColor.value,
  red: dangerColor.value,
};

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
