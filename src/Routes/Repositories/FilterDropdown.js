import React, { useState } from "react";
import { ToolbarItem, Select, SelectOption } from "@patternfly/react-core";

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
          placeholder="test"
          aria-label="Select input for filters"
          onToggle={toggle}
          onSelect={select}
          selections={dropdown.selected}
          isOpen={dropdown.isOpen}
        >
          {filters.map((filter, index) => (
            <SelectOption key={index} value={filter.label} />
          ))}
        </Select>
      </ToolbarItem>
    </>
  );
};

export default FilterDropdown;
