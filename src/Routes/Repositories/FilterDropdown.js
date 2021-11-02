import React from 'react';
import { ToolbarItem, Select, SelectOption } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';

const FilterDropdown = ({ filters, dropdown, setDropdown }) => {
  const toggle = () => {
    setDropdown((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  const clearSelection = () => {
    setDropdown({
      selected: null,
      isOpen: false,
    });
  };

  const select = (_e, selection) => {
    setDropdown({
      selected: selection,
      isOpen: false,
    });
  };

  return (
    <>
      <ToolbarItem>
        <Select
          variant="single"
          aria-label="Select input for filters"
          width="250px"
          onToggle={toggle}
          onSelect={select}
          selections={dropdown.selected}
          isOpen={dropdown.isOpen}
          toggleIcon={<FilterIcon />}
        >
          {filters.map((filter, index) => (
            <SelectOption width="275px" key={index} value={filter.label} />
          ))}
        </Select>
      </ToolbarItem>
    </>
  );
};

export default FilterDropdown;
