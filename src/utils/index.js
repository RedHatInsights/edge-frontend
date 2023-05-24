import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { useFlag, useFlagsStatus } from '@unleash/proxy-client-react';
import { releaseMapper, supportedReleases } from '../constants';

export const nameValidator = {
  type: validatorTypes.PATTERN,
  pattern: /^[A-Za-z0-9]+[A-Za-z0-9_\-\s]*$/,
  message:
    'Name must start with alphanumeric characters and can contain underscore and hyphen characters.',
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

// urlString is the string added to the url search param
// state is a boolean that adds or removes the urlString from the url
export const stateToUrlSearch = (urlString, state, search) => {
  var searchArray = [];
  const currentSearchArray =
    search?.length > 0
      ? search.includes('&')
        ? search.split('?')[1].split('&')
        : search.split('?').slice(1)
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

export const emptyStateNoFilters = (isLoading, count, search) =>
  isLoading !== true && !count > 0 && !search.includes('has_filters=true');

export const canUpdateSelectedDevices = ({ deviceData, imageData }) =>
  deviceData?.length > 0 && imageData
    ? deviceData?.some(
        (device) => device.imageSetId !== deviceData[0].imageSetId
      )
    : true;

export const useFeatureFlags = (flag) => {
  const { flagsReady } = useFlagsStatus();
  const isFlagEnabled = useFlag(flag);

  return flagsReady ? isFlagEnabled : false;
};

export const truncateString = (
  string = '',
  start,
  end = 0,
  separationString = '...'
) => {
  if (string.length <= start) {
    return string;
  }

  const updatedString = `${string.substring(
    0,
    start
  )}${separationString}${string.substring(string.length - end, string.length)}`;

  return updatedString;
};

export const transformSort = ({ direction, name }) => {
  return {
    sort_by: direction === 'asc' ? name : `-${name}`,
  };
};

export const isAccountMissing = (data) => data && !data?.Account;

// getReleases returns a list of the supported releases + the forced release
export const getReleases = (forcedRelease, inculdedReleases) =>
  Object.entries(releaseMapper)
    .filter(
      ([release]) =>
        (inculdedReleases ? inculdedReleases : supportedReleases).includes(
          release
        ) || release === forcedRelease
    )
    .map(([release, releaseLabel]) => ({
      value: release,
      label: releaseLabel,
    }));
