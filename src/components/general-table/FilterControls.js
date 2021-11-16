import React, { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import FilterInput from './FilterInput';
import PropTypes from 'prop-types';

const FilterControls = ({ filters, filterValues, setFilterValues }) => {
  const [dropdown, setDropdown] = useState({
    isOpen: false,
    selected: filters[0].label,
  });

  return (
    <>
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
