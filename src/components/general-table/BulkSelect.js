import React, { useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownToggleCheckbox,
  ToolbarItem,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const BulkSelect = ({ checkBoxState, setCheckBoxState }) => {
  const [selectAllToggle, setSelectAllToggle] = useState(false);

  const handleChange = () => {
    setCheckBoxState((prevState) => {
      if (prevState.selectAll) {
        return {
          ...prevState,
          checkedRows: [],
          selectAll: false,
        };
      }
      return {
        ...prevState,
        selectAll: true,
      };
    });
  };

  return (
    <>
      {checkBoxState.hasCheckbox && (
        <ToolbarItem variant="bulk-select">
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
              <DropdownItem key="page" isDisabled={checkBoxState.selectAll}>
                Select page
              </DropdownItem>,
              <DropdownItem key="none" isDisabled={!checkBoxState.selectAll}>
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
