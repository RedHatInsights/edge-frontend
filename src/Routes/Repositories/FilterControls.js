import React, { useState } from 'react';
import FilterDropdown from './FilterDropdown';
import FilterInput from './FilterInput';

const FilterControls = ({ filters, setInput }) => {
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
      <FilterInput filters={filters} input={dropdown.selected} />
    </>
  );
};

export default FilterControls;
