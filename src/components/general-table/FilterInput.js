import React, { useState } from 'react';
import {
  ToolbarItem,
  InputGroup,
  SearchInput,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';

const FilterInput = ({ filterValues, setFilterValues, input }) => {
  const selectedFilter = filterValues.find((filter) => filter.label === input);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = () => (value, checkboxValue) => {
    setFilterValues((prevState) => {
      const selectedIndex = prevState.findIndex(
        (filter) => filter.label === selectedFilter.label
      );
      const checkedType = prevState.find(
        (filter) => filter.label === selectedFilter.label
      );
      const checkboxIndex =
        selectedFilter.type === 'checkbox'
          ? checkedType.value.findIndex((i) => i.option === checkboxValue)
          : 0;
      const newValueArray = Object.values({
        ...checkedType.value,
        [checkboxIndex]: {
          ...checkedType.value[checkboxIndex],
          isChecked: !checkedType?.value[checkboxIndex]?.isChecked,
        },
      });
      const newTextValue = value;

      return Object.values({
        ...prevState,
        [selectedIndex]: {
          ...prevState[selectedIndex],
          value:
            selectedFilter.type === 'checkbox' ? newValueArray : newTextValue,
        },
      });
    });
  };

  const handleDeleteTextInput = () => {
    const filterLabelIndex = filterValues.findIndex(
      (value) => value.type === 'text'
    );
    setFilterValues((prevState) => {
      const changedValue = prevState[filterLabelIndex];
      if (changedValue.type === 'text') {
        return [
          ...prevState.slice(0, filterLabelIndex),
          { ...prevState[filterLabelIndex], value: '' },
          ...prevState.slice(filterLabelIndex + 1, prevState.length),
        ];
      }
      return prevState;
    });
  };

  if (selectedFilter.type === 'text') {
    return (
      <ToolbarItem data-testid="filter-input-testid">
        <InputGroup>
          <SearchInput
            name="textInput1"
            id="textInput1"
            type="search"
            aria-label={`Select input for ${selectedFilter.label.toLowerCase()}`}
            placeholder={`Filter by ${selectedFilter.label.toLowerCase()}`}
            onChange={debounce(handleFilterChange(), 500)}
            onClear={handleDeleteTextInput}
            value={filterValues.find((filter) => filter.type === 'text').value}
          />
        </InputGroup>
      </ToolbarItem>
    );
  }

  if (selectedFilter.type === 'checkbox') {
    return (
      <ToolbarItem data-testid="filter-input-testid">
        <InputGroup>
          <Select
            variant="checkbox"
            aria-label={`Select input for ${selectedFilter.label.toLowerCase()}`}
            width="11rem"
            placeholderText={`Filter by ${selectedFilter.label.toLowerCase()}`}
            isCheckboxSelectionBadgeHidden
            onToggle={() => setIsOpen((prevState) => !prevState)}
            onSelect={handleFilterChange()}
            selections={selectedFilter.value
              .filter((value) => value.isChecked == true)
              .map((arr) => arr.option)}
            isOpen={isOpen}
          >
            {selectedFilter.value.map((filter, index) => (
              <SelectOption
                key={index}
                value={filter.option}
                isChecked={filter.isChecked}
              />
            ))}
          </Select>
        </InputGroup>
      </ToolbarItem>
    );
  }
};

FilterInput.propTypes = {
  filterValues: PropTypes.array,
  setFilterValues: PropTypes.func,
  input: PropTypes.string,
};

export default FilterInput;
