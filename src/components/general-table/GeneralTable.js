import React, { useState, useEffect } from 'react';
import ToolbarHeader from './ToolbarHeader';
import ToolbarFooter from './ToolbarFooter';
import createFilterValues from '../../components/general-table/createFilterValues';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
} from '@patternfly/react-table';
import { Skeleton } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import CustomEmptyState from '../Empty';
import { useDispatch } from 'react-redux';
import { transformSort } from '../../Routes/ImageManager/constants';

const filterParams = (chipsArray) => {
  const filterParamsObj =
    chipsArray.length > 0
      ? chipsArray.reduce((acc, filter) => {
          if (acc[filter.key.toLowerCase()]) {
            const returnAcc =
              typeof acc[filter.key.toLowerCase()] === 'string'
                ? [acc[filter.key.toLowerCase()]]
                : [...acc[filter.key.toLowerCase()]];
            return {
              ...acc,
              [filter.key.toLowerCase()]: [
                ...returnAcc,
                filter.apiName ? filter.apiName : filter.value,
              ],
            };
          } else {
            return {
              ...acc,
              [filter.key.toLowerCase()]: filter.apiName
                ? filter.apiName
                : filter.value || filter.label,
            };
          }
        }, {})
      : {};
  return filterParamsObj;
};

const GeneralTable = ({
  apiFilterSort,
  urlParam,
  filters,
  loadTableData,
  tableData,
  columnNames,
  rows,
  toolbarButtons,
  actionResolver,
  areActionsDisabled,
  defaultSort,
  emptyStateMessage,
  emptyStateAction,
  emptyStateActionMessage,
  toggleButton,
  toggleAction,
  toggleState,
  hasCheckbox = false,
  skeletonRowQuantity,
}) => {
  const [filterValues, setFilterValues] = useState(createFilterValues(filters));
  const [chipsArray, setChipsArray] = useState([]);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [checkBoxState, setCheckBoxState] = useState({
    hasCheckbox: hasCheckbox,
    selectAll: false,
    checkedRows: [],
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const query = apiFilterSort
      ? {
          ...filterParams(chipsArray),
          limit: perPage,
          offset: (page - 1) * perPage,
          ...transformSort({
            direction: sortBy.direction,
            name: columns[sortBy.index].type,
          }),
        }
      : null;
    apiFilterSort && urlParam
      ? loadTableData(dispatch, urlParam, query)
      : apiFilterSort
      ? loadTableData(dispatch, query)
      : null;
  }, [chipsArray, perPage, page, sortBy]);

  const { count, isLoading, hasError } = tableData;

  //Used for repos until the api can sort and filter
  const filteredByName = () => {
    const activeFilters = filterValues.filter(
      (filter) =>
        (filter?.type === 'text' && filter?.value !== '') ||
        (filter?.type === 'checkbox' &&
          filter?.value.find((checked) => checked.isChecked))
    );
    const filteredArray = rows.filter((row) => {
      if (activeFilters.length > 0) {
        return activeFilters?.every((filter) => {
          if (filter.type === 'text') {
            return row.noApiSortFilter[
              columnNames.findIndex((row) => row.title === filter.label)
            ]
              .toLowerCase()
              .includes(filter.value.toLowerCase());
          } else if (filter.type === 'checkbox') {
            return filter.value.some(
              (value) =>
                value.isChecked &&
                row.noApiSortFilter[
                  columnNames.findIndex((row) => row.title === filter.label)
                ].toLowerCase() === value.value.toLowerCase()
            );
          }
        });
      } else {
        return row;
      }
    });
    return filteredArray;
  };

  const filteredByNameRows = !apiFilterSort && filteredByName();

  //non-api sort function
  const sortedByDirection = (rows) =>
    rows.sort((a, b) =>
      typeof a?.noApiSortFilter[sortBy.index] === 'number'
        ? sortBy.direction === 'asc'
          ? a?.noApiSortFilter[sortBy.index] - b?.noApiSortFilter[sortBy.index]
          : b?.noApiSortFilter[sortBy.index] - a?.noApiSortFilter[sortBy.index]
        : sortBy.direction === 'asc'
        ? a?.noApiSortFilter[sortBy.index].localeCompare(
            b?.noApiSortFilter[sortBy.index],
            undefined,
            { sensitivity: 'base' }
          )
        : b?.noApiSortFilter[sortBy.index].localeCompare(
            a?.noApiSortFilter[sortBy.index],
            undefined,
            { sensitivity: 'base' }
          )
    );

  const nonApiCount = !apiFilterSort
    ? sortedByDirection(filteredByNameRows)?.length
    : 0;

  const handleSort = (_event, index, direction) => {
    setSortBy({ index, direction });
  };

  const toShowSort =
    isLoading || hasError || (count?.length > 0 && filters.length > 0);

  const columns = columnNames.map((columnName) => ({
    title: columnName.title,
    type: columnName.type,
    transforms: toShowSort ? [] : columnName.sort ? [sortable] : [],
    columnTransforms: columnName.columnTransforms
      ? columnName.columnTransforms
      : [],
  }));

  const filteredRows = apiFilterSort
    ? rows
    : rows.length > 0
    ? sortedByDirection(filteredByNameRows).slice(
        (page - 1) * perPage,
        (page - 1) * perPage + perPage
      )
    : rows;

  const selectedRows = () =>
    filteredRows.map((row) =>
      checkBoxState.checkedRows.some((checkedRow) => checkedRow.id === row.id)
        ? {
            ...row,
            selected: true,
          }
        : {
            ...row,
            selected: false,
          }
    );

  const handleSelect = (_event, isSelecting, rowIndex) => {
    setCheckBoxState((prevState) => ({
      ...prevState,
      selectAll: false,
      checkedRows: isSelecting
        ? [
            ...prevState.checkedRows,
            {
              id: filteredRows[rowIndex].id,
            },
          ]
        : prevState.checkedRows.filter(
            (row) => row.id !== filteredRows[rowIndex].id
          ),
    }));
  };

  useEffect(() => {
    if (
      checkBoxState.checkedRows.length > 0 &&
      checkBoxState.checkedRows.length === filteredRows.length
    ) {
      setCheckBoxState((prevState) => ({
        ...prevState,
        selectAll: true,
      }));
    }
  }, [checkBoxState.checkedRows]);

  useEffect(() => {
    if (checkBoxState.selectAll) {
      setCheckBoxState((prevState) => ({
        ...prevState,
        checkedRows: [
          ...filteredRows.map((row) => ({
            id: row?.id,
          })),
        ],
      }));
    }
  }, [checkBoxState.selectAll]);

  const loadingRows = (perPage) =>
    [...Array(skeletonRowQuantity ?? perPage)].map(() => ({
      cells: columnNames.map(() => ({ title: <Skeleton width="100%" /> })),
    }));

  return (
    <>
      <ToolbarHeader
        count={apiFilterSort ? count : nonApiCount}
        toolbarButtons={toolbarButtons}
        filters={filters}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        chipsArray={chipsArray}
        setChipsArray={setChipsArray}
        isLoading={isLoading}
        perPage={perPage}
        setPerPage={setPerPage}
        page={page}
        setPage={setPage}
        toggleButton={toggleButton}
        toggleAction={toggleAction}
        toggleState={toggleState}
        checkBoxState={checkBoxState}
        setCheckBoxState={setCheckBoxState}
      />
      {!isLoading && count < 1 ? (
        <CustomEmptyState
          data-testid="general-table-empty-state-no-match"
          bgColor="white"
          icon="search"
          title={emptyStateMessage}
          secondaryActions={[
            {
              title: emptyStateActionMessage,
              onClick: () => emptyStateAction(),
            },
          ]}
        />
      ) : !isLoading && !filteredRows?.length > 0 ? (
        <CustomEmptyState
          data-testid="general-table-empty-state-no-match"
          bgColor="white"
          icon="search"
          title="No match found"
          secondaryActions={[
            {
              title: 'Clear all filters',
              onClick: () => setFilterValues(createFilterValues(filters)),
            },
          ]}
        />
      ) : (
        <Table
          data-testid="general-table-testid"
          variant="compact"
          aria-label="General Table Component"
          sortBy={sortBy}
          onSort={handleSort}
          actionResolver={actionResolver ? actionResolver : null}
          areActionsDisabled={areActionsDisabled}
          cells={columns}
          rows={
            isLoading
              ? loadingRows(perPage)
              : checkBoxState.hasCheckbox
              ? selectedRows()
              : filteredRows
          }
          onSelect={checkBoxState.hasCheckbox && handleSelect}
          canSelectAll={false}
        >
          <TableHeader />
          <TableBody />
        </Table>
      )}

      <ToolbarFooter
        isLoading={isLoading}
        count={apiFilterSort ? count : nonApiCount}
        setFilterValues={setFilterValues}
        perPage={perPage}
        setPerPage={setPerPage}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

GeneralTable.propTypes = {
  apiFilterSort: PropTypes.bool,
  filters: PropTypes.array,
  urlParam: PropTypes.string,
  loadTableData: PropTypes.func,
  tableData: PropTypes.object,
  columnNames: PropTypes.array,
  rows: PropTypes.array,
  actionResolver: PropTypes.func,
  areActionsDisabled: PropTypes.func,
  defaultSort: PropTypes.object,
  toolbarButtons: PropTypes.array,
  emptyStateMessage: PropTypes.string,
  emptyStateActionMessage: PropTypes.string,
  emptyStateAction: PropTypes.func,
  toggleButton: PropTypes.array,
  toggleAction: PropTypes.func,
  toggleState: PropTypes.number,
  hasCheckbox: PropTypes.bool,
  skeletonRowQuantity: PropTypes.number,
};

export default GeneralTable;
