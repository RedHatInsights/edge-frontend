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
  checkBoxState,
  handleBulkSelect,
  handlePageSelect,
  handleNoneSelect,
}) => {
  const [selectAllToggle, setSelectAllToggle] = useState(false);

  return (
    <>
      <ToolbarItem variant='bulk-select'>
        <Dropdown
          toggle={
            <DropdownToggle
              id='stacked-example-toggle'
              splitButtonItems={[
                <DropdownToggleCheckbox
                  id='example-checkbox-2'
                  key='split-checkbox'
                  aria-label='Select all'
                  isChecked={checkBoxState.selectAll}
                  onChange={
                    checkBoxState.selectAll
                      ? handleNoneSelect
                      : handlePageSelect
                  }
                >
                  {checkBoxState.checkedRows.length > 0 &&
                    `${checkBoxState.checkedRows.length} selected`}
                </DropdownToggleCheckbox>,
              ]}
              onToggle={() => setSelectAllToggle((prevState) => !prevState)}
            />
          }
          isOpen={selectAllToggle}
          dropdownItems={[
            <DropdownItem key='all' onClick={handleBulkSelect}>
              Select all
            </DropdownItem>,
            <DropdownItem
              key='page'
              onClick={handlePageSelect}
              isDisabled={checkBoxState.selectAll}
            >
              Select page
            </DropdownItem>,
            <DropdownItem
              key='none'
              onClick={handleNoneSelect}
              isDisabled={checkBoxState.checkedRows.length === 0}
            >
              Select none
            </DropdownItem>,
          ]}
        />
      </ToolbarItem>
    </>
  );
};
BulkSelect.propTypes = {
  checkBoxState: PropTypes.object,
  handleBulkSelect: PropTypes.func,
  handleNoneSelect: PropTypes.func,
  handlePageSelect: PropTypes.func,
};

export default BulkSelect;
