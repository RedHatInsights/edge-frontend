import React, { useState } from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Select, SelectOption, Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import {
  imageTypeMapper,
  DEFAULT_RELEASE,
  TEMPORARY_RELEASE,
  temporaryReleases,
  supportedReleases,
} from '../../../constants';
import { getReleases } from '../../../utils';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { useFeatureFlags } from '../../../utils';

const ReleaseLabel = () => {
  const temporaryReleasesFlag = useFeatureFlags(
    'fleet-management.temporary-releases'
  );
  const { change, getState } = useFormApi();
  const release =
    getState()?.values?.release ||
    (temporaryReleasesFlag ? TEMPORARY_RELEASE : DEFAULT_RELEASE);
  const releases =
    getState()?.values?.release_options ||
    (temporaryReleasesFlag
      ? getReleases(release, [...supportedReleases, ...temporaryReleases])
      : getReleases(release));
  const [options, setOptions] = useState(releases);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(release);

  const onToggle = (isOpen) => setIsOpen(isOpen);

  const onSelect = (_event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
    }
    change('release', selection);
  };

  const clearSelection = () => {
    setSelected(release);
    setIsOpen(false);
    setOptions(releases);
  };

  return (
    <Select
      variant="single"
      width="100%"
      onToggle={onToggle}
      onSelect={onSelect}
      selections={selected}
      isOpen={isOpen}
      style={{ paddingLeft: 0, marginLeft: 0 }}
    >
      {options.map((item) => (
        <SelectOption key={item.value} value={item.value}>
          {item.label}
        </SelectOption>
      ))}
    </Select>
  );
};

export default {
  title: 'Options',
  name: 'imageOutput',
  nextStep: ({ values }) =>
    values?.imageType?.includes('rhel-edge-installer') || !values.imageType
      ? 'registration'
      : 'packages',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <Text>Enter some basic information about your image.</Text>,
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'release',
      label: <ReleaseLabel />,
      validate: [{ type: validatorTypes.REQUIRED }],
      isRequired: true,
    },
    {
      component: 'image-output-checkbox',
      name: 'imageType',
      options: Object.entries(imageTypeMapper).map(
        ([imageType, imageTypeLabel]) => ({
          value: imageType,
          label: imageTypeLabel,
        })
      ),
      initialValue: ['rhel-edge-installer', 'rhel-edge-commit'],
      clearedValue: [],
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
};
