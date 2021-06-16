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

export const isEmptyFilters = (activeFilters) =>
  Object.values(activeFilters).find(
    (item) => item?.value?.length > 0 || item?.length > 0
  );

export const constructActiveFilters = (activeFilters, getLabel) =>
  Object.entries(activeFilters).map(([key, { label, value } = {}]) => ({
    category: label,
    chipKey: key,
    chips:
      value?.length > 0
        ? Array.isArray(value)
          ? value.map((item) => ({
              name: getLabel?.(item) || item,
              value: item,
            }))
          : [
              {
                name: getLabel?.(value) || value,
                value,
              },
            ]
        : [],
  }));

export const onDeleteFilter = (activeFilters, itemsToRemove) => {
  const currItem = itemsToRemove[0];
  return {
    ...activeFilters,
    [currItem?.chipKey]: {
      ...(activeFilters[currItem?.chipKey] || {}),
      value: Array.isArray(activeFilters[currItem?.chipKey]?.value)
        ? activeFilters[currItem?.chipKey]?.value?.filter(
            (item) => !currItem?.chips?.find(({ value }) => value === item)
          )
        : '',
    },
  };
};

export const deviceSummaryMapper = [
  'active',
  'noReports',
  'neverReported',
  'orphaned',
];

export const inventoryFields = {
  system_profile: { host_type: 'edge' },
};

export const imageDistributionMapper = {
  'rhel-8.1': 'RHEL 8.1',
  'rhel-8.2': 'RHEL 8.2',
  'rhel-8.3': 'RHEL 8.3',
};

export const imageArchMapper = {
  x86_64: '64bit',
  arm: 'Arm',
};
