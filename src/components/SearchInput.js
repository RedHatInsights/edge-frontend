import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const SelectInputApi = (props) => {
  useFieldApi(props);
  const { change } = useFormApi();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const onToggle = (isOpen) => setIsOpen(isOpen);

  const onSelect = (_event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
    }
    change('group', selection);
  };

  const clearSelection = () => {
    setSelected(null);
    change('group', null);
    setIsOpen(false);
  };

  return (
    <>
      <Select
        variant="typeahead"
        typeAheadAriaLabel="Select a state"
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={selected}
        isOpen={isOpen}
        aria-labelledby="typeahead-select-id-1"
        placeholderText="Type or click select group"
      >
        {props.defaultOptions.map(({ DeviceGroup }, index) => (
          <SelectOption
            key={index}
            value={{
              toString: () => DeviceGroup.Name,
              groupId: DeviceGroup.ID,
            }}
            {...(DeviceGroup.description && {
              description: DeviceGroup.description,
            })}
          />
        ))}
      </Select>
    </>
  );
};

SelectInputApi.propTypes = {
  defaultOptions: PropTypes.array,
};

export default SelectInputApi;
