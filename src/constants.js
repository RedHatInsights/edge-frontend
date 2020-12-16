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
  done: { icon: CheckCircleIcon, color: successColor.value },
  error: { icon: ExclamationCircleIcon, color: dangerColor.value },
  pending: { icon: PauseCircleIcon },
  updating: { icon: CircleNotchIcon },
  unknown: { icon: UnknownIcon },
  warning: { icon: ExclamationTriangleIcon, color: warningColor.value },
  notification: { icon: BellIcon, color: infoColor.value },
};
