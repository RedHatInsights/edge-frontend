import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownToggleCheckbox,
  ToolbarItem,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const BulkSelect = ({
  checkedRows,
  handleBulkSelect,
  handlePageSelect,
  handleNoneSelect,
  displayedRowsLength,
  perPage,
  total,
}) => {
  const isAllSelected = checkedRows.length === total;
  const isPartiallySelected = checkedRows.length > 0 ? true : false;
  const [selectAllToggle, setSelectAllToggle] = useState(false);

  return (
    <>
      <ToolbarItem variant="bulk-select">
        <Dropdown
          toggle={
            <DropdownToggle
              id="stacked-example-toggle"
              splitButtonItems={[
                <DropdownToggleCheckbox
                  id="example-checkbox-2"
                  key="split-checkbox"
                  aria-label="Select all"
                  isChecked={isAllSelected ? true : isPartiallySelected}
                  onChange={isAllSelected || isPartiallySelected ? handleNoneSelect : handlePageSelect}
                >
                  {checkedRows.length > 0 && `${checkedRows.length} selected`}
                </DropdownToggleCheckbox>,
              ]}
              onToggle={() => setSelectAllToggle((prevState) => !prevState)}
            />
          }
          isOpen={selectAllToggle}
          dropdownItems={[
            <DropdownItem
              key="none"
              onClick={handleNoneSelect}
              isDisabled={checkedRows.length === 0}
            >
              Select none (0 items)
            </DropdownItem>,

            <DropdownItem
              key="page"
              onClick={handlePageSelect}
              isDisabled={isAllSelected}
            >
              Select page ({perPage} {total.length === 1 ? 'item' : 'items'})
            </DropdownItem>,
            <DropdownItem key="all" onClick={handleBulkSelect}>
              Select all ({total} {total.length === 1 ? 'item' : 'items'})
            </DropdownItem>,
          ]}
        />
      </ToolbarItem>
    </>
  );
};
BulkSelect.propTypes = {
  checkedRows: PropTypes.array,
  handleBulkSelect: PropTypes.func,
  handleNoneSelect: PropTypes.func,
  handlePageSelect: PropTypes.func,
  displayedRowsLength: PropTypes.number,
  perPage: PropTypes.number,
  total: PropTypes.number,
};

export default BulkSelect;
