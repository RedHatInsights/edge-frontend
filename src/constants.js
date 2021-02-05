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

export const constructActiveFilters = (activeFilters) =>
  Object.entries(activeFilters).map(([key, { label, value } = {}]) => ({
    category: label,
    chipKey: key,
    chips:
      value?.length > 0
        ? Array.isArray(value)
          ? value.map((item) => ({ name: item }))
          : [
              {
                name: value,
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
            (item) => !currItem?.chips?.find(({ name }) => name === item)
          )
        : '',
    },
  };
};
