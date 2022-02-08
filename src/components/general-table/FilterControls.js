import React, { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import FilterInput from './FilterInput';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownToggle, DropdownToggleCheckbox, ToolbarItem } from '@patternfly/react-core';

const FilterControls = ({ filters, filterValues, setFilterValues, checkBoxState, setCheckBoxState }) => {
  const [selectAllToggle, setSelectAllToggle] = useState(false)
  const [dropdown, setDropdown] = useState({
    isOpen: false,
    selected: filters[0].label,
  });

  const handleChange = () => {
    setCheckBoxState(prevState => {
      if (prevState.selectAll) {
        return {
          ...prevState,
          checkedRows: [],
          selectAll: false,
        }
      } 
      return {
        ...prevState,
        selectAll: true
      }
    })
  }

  return (
    <>
      {checkBoxState.hasCheckbox && (
        <ToolbarItem variant='bulk-select'>
          <Dropdown
            onSelect={handleChange}
            toggle={
              <DropdownToggle
                id="stacked-example-toggle"
                splitButtonItems={[
                  <DropdownToggleCheckbox
                    id="example-checkbox-2"
                    key="split-checkbox" 
                    aria-label="Select all" 
                    isChecked={checkBoxState.selectAll} 
                    onChange={handleChange}
                  >
                    {checkBoxState.checkedRows.length > 0 && `${checkBoxState.checkedRows.length} selected`}
                  </DropdownToggleCheckbox>
                ]}
                onToggle={() => setSelectAllToggle(prevState => !prevState)}
              />
            }
            isOpen={selectAllToggle}
            dropdownItems={[
              //<DropdownItem key='all'>Select all</DropdownItem>,
              <DropdownItem key='page' isDisabled={checkBoxState.selectAll} >Select page</DropdownItem>,
              <DropdownItem key='none' isDisabled={!checkBoxState.selectAll} >Select none</DropdownItem>
            ]}
          />
        </ToolbarItem>
      )}
      <FilterDropdown
        dropdown={dropdown}
        setDropdown={setDropdown}
        filters={filters}
      />
      <FilterInput
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        input={dropdown.selected}
      />
    </>
  );
};

FilterControls.propTypes = {
  filters: PropTypes.array,
  filterValues: PropTypes.array,
  setFilterValues: PropTypes.func,
};

export default FilterControls;
