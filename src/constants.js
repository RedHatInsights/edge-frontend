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

import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

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

export const nameValidator = {
  type: validatorTypes.PATTERN,
  pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-\s]*$/,
  message:
    'Can only contain letters, numbers, spaces, hyphens ( - ), and underscores( _ ).',
};

export const mapUrlToObj = (url, keys) => {
  const splitUrl = url.split('/');
  const obj = {};

  for (let i = 1; i < splitUrl.length; i++) {
    if (splitUrl[i]) {
      obj[keys[i - 1]] = splitUrl[i];
    }
  }

  obj.buildUrl = function () {
    return Object.values(this).reduce(
      (acc, curr) => (typeof curr !== 'function' ? `${acc}/${curr}` : acc),
      ''
    );
  };

  return obj;
};

//urlString is the string added to the url search param
//state is a boolean that adds or removes the urlString from the url
export const stateToUrlSearch = (urlString, state) => {
  var searchArray = [];
  const currentSearchArray =
    location.search.length > 0
      ? location.search.includes('&')
        ? location.search.split('?')[1].split('&')
        : location.search.split('?').slice(1)
      : [];
  if (state) {
    currentSearchArray.includes(urlString)
      ? currentSearchArray
      : currentSearchArray.push(urlString);
    searchArray = currentSearchArray;
  } else {
    searchArray = currentSearchArray.includes(urlString)
      ? currentSearchArray.filter((e) => e !== urlString)
      : currentSearchArray;
  }

  return searchArray.join('&');
};

export const emptyStateNoFliters = (isLoading, count, history) =>
  isLoading !== true &&
  !count > 0 &&
  !history.location.search.includes('has_filters=true');
