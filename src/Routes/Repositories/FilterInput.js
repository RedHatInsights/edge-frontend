import React, { useState } from "react";
import {
  ToolbarItem,
  InputGroup,
  TextInput,
  Button,
  Checkbox,
  Dropdown,
  DropdownToggle,
  DropdownItem,
} from "@patternfly/react-core";
import SearchIcon from "@patternfly/react-icons/dist/esm/icons/search-icon";
import CaretDownIcon from "@patternfly/react-icons/dist/esm/icons/caret-down-icon";

const FilterInput = ({ filterValues, setFilterValues, input }) => {
  const selectedFilter = filterValues.find((filter) => filter.label === input);
  const [isOpen, setIsOpen] = useState(false);
  /*
  const [selectedFilter, setSelectedFilter] = useState();

  */

  if (selectedFilter.type === "text") {
    return (
      <ToolbarItem>
        <InputGroup>
          <TextInput
            name="textInput1"
            id="textInput1"
            type="search"
            aria-label="search input example"
            placeholder="Filter by name"
            onChange={(value) => setInput(value)}
          />
          <Button variant="control" aria-label="search button for search input">
            <SearchIcon />
          </Button>
        </InputGroup>
      </ToolbarItem>
    );
  }

  if (selectedFilter.type === "checkbox") {
    const dropdownItems = selectedFilter.value.map((filter) => (
      <DropdownItem>
        <Checkbox
          id={filter.label}
          isChecked={filter.isChecked}
          onChange={setFilterValues((prevState) => ({}))}
          label={filter.label}
        />
      </DropdownItem>
    ));
    return (
      <ToolbarItem>
        <InputGroup>
          <Dropdown
            toggle={
              <DropdownToggle
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
