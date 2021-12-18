import React from 'react';
import { ToolbarItem, Select, SelectOption } from '@patternfly/react-core';
import { FilterIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const FilterDropdown = ({ filters, dropdown, setDropdown }) => {
  const toggle = () => {
    setDropdown((prevState) => ({
      ...prevState,
      isOpen: !prevState.isOpen,
    }));
  };

  const select = (_e, selection) => {
    setDropdown({
      selected: selection,
      isOpen: false,
    });
  };

  return (
    <>
      {filters.length > 1 ? (
        <ToolbarItem data-testid="filter-dropdown-testid" className='pf-u-mr-0' >
          <Select
            variant="single"
            aria-label="Select input for filters"
            width="11rem"
            onToggle={toggle}
            onSelect={select}
            selections={dropdown.selected}
            isOpen={dropdown.isOpen}
            toggleIcon={<FilterIcon />}
          >
            {filters.map((filter, index) => (
              <SelectOption key={index} value={filter.label} />
            ))}
          </Select>
        </ToolbarItem>
      ) : null}
    </>
  );
};

FilterDropdown.propTypes = {
  filters: PropTypes.array,
  dropdown: PropTypes.object,
  setDropdown: PropTypes.func,
};

export default FilterDropdown;
