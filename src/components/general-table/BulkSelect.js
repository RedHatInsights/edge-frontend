import React, { useCallback, useState } from 'react';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownToggleCheckbox,
  ToolbarItem,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFetchBatched from '../../hooks/useFetchBatched';
import { getInventory } from '../../api/devices';
import { flatten, map } from 'lodash';

const BulkSelect = ({
  checkedRows,
  handleBulkSelect,
  handlePageSelect,
  handleNoneSelect,
  perPage,
  total,
  filters,
  filterParams,
  apiFilterSort,
}) => {
  const isAllSelected = checkedRows.length === total;
  const isPartiallySelected = checkedRows.length > 0 ? true : false;
  const [selectAllToggle, setSelectAllToggle] = useState(false);
  const { fetchBatched } = useFetchBatched();

  const fetchAllSystemIds = useCallback((filters, total) => {
    console.log(filters);
    const query = apiFilterSort
      ? {
          ...filterParams(filters.filters),
        }
      : null;
    return fetchBatched(getInventory, total, query);
  }, []);

  const selectAllIds = async () => {
    if (location.pathname.includes('inventory')) {
      const data = await fetchAllSystemIds({ filters }, total);
      const results = flatten(map(data, 'data'));
      const rows = flatten(map(results, 'devices'));
      const rowInfo = [];
      rows.forEach((row) => {
        rowInfo.push({
          deviceID: row.DeviceID,
          id: row.DeviceUUID,
          display_name: row.DeviceName,
          imageSetId: row.ImageSetID,
          imageName: row.ImageName,
          deviceGroups: [],
        });
      });

      handleBulkSelect(rowInfo);
    } else {
      handlePageSelect();
    }
  };

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
                  onChange={
                    isAllSelected || isPartiallySelected
                      ? handleNoneSelect
                      : handlePageSelect
                  }
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
            <DropdownItem
              key="all"
              onClick={async () => {
                await selectAllIds();
              }}
            >
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
  filters: PropTypes.array,
  filterParams: PropTypes.func,
  apiFilterSort: PropTypes.bool,
};

export default BulkSelect;
