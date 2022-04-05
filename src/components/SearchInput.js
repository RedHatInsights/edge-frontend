import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select, SelectOption } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const SelectInput = ({ defaultOptions }) => {
  const { change } = useFormApi();
  const [options, setOptions] = useState(defaultOptions);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const onToggle = (isOpen) => setIsOpen(isOpen);

  const onSelect = (_event, selection, isPlaceholder) => {
    console.log('select');
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
      console.log('selected:', selection.toString());
    }
    change('group', selection);
  };

  const clearSelection = () => {
    setSelected(null);
    setIsOpen(false);
    setOptions(defaultOptions);
  };

  return (
    <div>
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
        {options?.map((option, index) => (
          <SelectOption
            key={index}
            value={{ toString: () => option.Name, groupId: option.ID }}
            {...(option.description && { description: option.description })}
          />
        ))}
      </Select>
    </div>
  );
};

SelectInput.propTypes = {
  defaultOptions: PropTypes.array,
};

export default SelectInput;
