import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownToggleCheckbox,
  ToolbarItem,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const BulkSelect = ({ checkBoxState, handleBulkSelect }) => {
  const [selectAllToggle, setSelectAllToggle] = useState(false);

  return (
    <>
      {checkBoxState.hasCheckbox && (
        <ToolbarItem variant='bulk-select'>
          <Dropdown
            onSelect={handleBulkSelect}
            toggle={
              <DropdownToggle
                id='stacked-example-toggle'
                splitButtonItems={[
                  <DropdownToggleCheckbox
                    id='example-checkbox-2'
                    key='split-checkbox'
                    aria-label='Select all'
                    isChecked={checkBoxState.selectAll}
                    onChange={handleBulkSelect}
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
              //<DropdownItem key='all'>Select all</DropdownItem>,
              <DropdownItem key='page' isDisabled={checkBoxState.selectAll}>
                Select page
              </DropdownItem>,
              <DropdownItem key='none' isDisabled={!checkBoxState.selectAll}>
                Select none
              </DropdownItem>,
            ]}
          />
        </ToolbarItem>
      )}
    </>
  );
};
BulkSelect.propTypes = {
  setCheckBoxState: PropTypes.func,
  checkBoxState: PropTypes.object,
};

export default BulkSelect;
