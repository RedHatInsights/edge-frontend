import React, { useEffect, useState } from 'react';
import {
  ToolbarItem,
  InputGroup,
  SearchInput,
  Checkbox,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from '@patternfly/react-core';
import { debounce } from 'lodash';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';

const FilterInput = ({ filterValues, setFilterValues, input }) => {
  const selectedFilter = filterValues.find((filter) => filter.label === input);
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (index) => (checked, event) => {
    setFilterValues((prevState) => {
      const selectedIndex = prevState.findIndex(
        (filter) => filter.label === selectedFilter.label
      );
      const checkedType = prevState.find(
        (filter) => filter.label === selectedFilter.label
      );
      const newValueArray = Object.values({
        ...checkedType.value,
        [index]: { ...checkedType.value[index], isChecked: checked },
      });
      const newTextValue = event.target.value;

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
            width="275px"
            onChange={debounce(handleFilterChange(), 500)}
            value={filterValues.find((filter) => filter.type === 'text').value}
          />
        </InputGroup>
      </ToolbarItem>
    );
  }

  if (selectedFilter.type === 'checkbox') {
    const dropdownItems = selectedFilter.value.map((filter, index) => (
      <DropdownItem>
        <Checkbox
          id={filter.id}
          isChecked={filter.isChecked}
          onChange={handleFilterChange(index)}
          label={filter.option}
        />
      </DropdownItem>
    ));
    return (
      <ToolbarItem>
        <InputGroup>
          <Dropdown
            toggle={
              <DropdownToggle
                width="275px"
                id="toggle-id"
                onToggle={() => setIsOpen((prevState) => !prevState)}
                toggleIndicator={CaretDownIcon}
              >
                {`Filter by ${selectedFilter.label}`}
              </DropdownToggle>
            }
            isOpen={isOpen}
            dropdownItems={dropdownItems}
          />
        </InputGroup>
      </ToolbarItem>
    );
  }
};

export default FilterInput;
