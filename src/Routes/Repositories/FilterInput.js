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

  if (selectedFilter.type === 'text') {
    return (
      <ToolbarItem>
        <InputGroup>
          <SearchInput
            name="textInput1"
            id="textInput1"
            type="search"
            aria-label="search input example"
            placeholder="Filter by name"
            onChange={debounce(handleFilterChange(), 500)}
            value={filterValues.find((filter) => filter.type === 'text').value}
          />
        </InputGroup>
      </ToolbarItem>
    );
  }

  if (selectedFilter.type === 'checkbox') {
    return (
      <ToolbarItem>
        <InputGroup>
          <Select
            variant="checkbox"
            aria-label={`Select input for ${selectedFilter.label}`}
            width="11rem"
            placeholderText={`Filter by ${selectedFilter.label}`}
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
  filterValues: PropTypes.object,
  setFilterValues: PropTypes.func,
  input: PropTypes.string,
};

export default FilterInput;
