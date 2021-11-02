import React, { useState } from 'react';
import {
  ToolbarItem,
  InputGroup,
  SearchInput,
  Checkbox,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';

const FilterInput = ({ filterValues, setFilterValues, input }) => {
  const selectedFilter = filterValues.find((filter) => filter.label === input);
  const [isOpen, setIsOpen] = useState(false);
  /*
  const [selectedFilter, setSelectedFilter] = useState();
  
  */

  const handleFilterChange = (label, index) => (checked, event) => {
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
      return Object.values({
        ...prevState,
        [selectedIndex]: {
          ...prevState[selectedIndex],
          value: newValueArray,
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
            onChange={(value) => setInput(value)}
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
          onChange={handleFilterChange([filter.option], index)}
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
