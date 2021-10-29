import React, { useState } from "react";
import FilterDropdown from "./FilterDropdown";
import FilterInput from "./FilterInput";

const FilterControls = ({
  filters,
  filterValues,
  setFilterValues,
  setInput,
}) => {
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

export default FilterControls;
