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
import BulkSelect from './BulkSelect';
import { useHistory } from 'react-router-dom';
import { stateToUrlSearch } from '../../constants';

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
  emptyFilterState,
  toggleButton,
  toggleAction,
  toggleState,
  hasCheckbox = false,
  skeletonRowQuantity,
  selectedItems,
  initSelectedItems,
  kebabItems,
  hasModalSubmitted,
  setHasModalSubmitted,
  isUseApi,
}) => {
  const defaultCheckedRows = initSelectedItems ? initSelectedItems : [];
  const [filterValues, setFilterValues] = useState(createFilterValues(filters));
  const [chipsArray, setChipsArray] = useState([]);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [checkedRows, setCheckedRows] = useState(defaultCheckedRows);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (
      //!history.location.search.includes('add_system_modal=true') &&
      !history.location.search.includes('create_image=true') &&
      !history.location.search.includes('update_image=true')
    ) {
      history.push({
        pathname: history.location.pathname,
        search: stateToUrlSearch('has_filters=true', chipsArray.length > 0),
      });
    }

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

    if (isUseApi) {
      loadTableData(query);
      return;
    }

    apiFilterSort && urlParam
      ? loadTableData(dispatch, urlParam, query)
      : apiFilterSort
      ? loadTableData(dispatch, query)
      : null;
  }, [chipsArray, perPage, page, sortBy]);

  useEffect(() => {
    setCheckedRows(defaultCheckedRows);
  }, [hasModalSubmitted]);

  useEffect(() => {
    selectedItems && selectedItems(checkedRows);
    hasModalSubmitted && setHasModalSubmitted(false);
  }, [checkedRows]);

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
    rows.sort((a, b) => {
      const index = hasCheckbox ? sortBy.index - 1 : sortBy.index;
      return typeof a?.noApiSortFilter[index] === 'number'
        ? sortBy.direction === 'asc'
          ? a?.noApiSortFilter[index] - b?.noApiSortFilter[index]
          : b?.noApiSortFilter[index] - a?.noApiSortFilter[index]
        : sortBy.direction === 'asc'
        ? a?.noApiSortFilter[index].localeCompare(
            b?.noApiSortFilter[index],
            undefined,
            { sensitivity: 'base' }
          )
        : b?.noApiSortFilter[index].localeCompare(
            a?.noApiSortFilter[index],
            undefined,
            { sensitivity: 'base' }
          );
    });

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

  const checkboxRows = () =>
    filteredRows.map((row) =>
      checkedRows.some((checkedRow) => checkedRow.id === row.rowInfo.id)
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
    setCheckedRows((prevState) => {
      return isSelecting
        ? [...prevState, { ...filteredRows[rowIndex].rowInfo }]
        : prevState.filter(
            (row) => row.id !== filteredRows[rowIndex].rowInfo.id
          );
    });
  };

  const handlePageSelect = () => {
    setCheckedRows((prevState) => {
      const checkedIds = prevState.map((row) => row.id);
      const rowIsNotIncluded = (id) => !checkedIds.includes(id);

      const newRows = [];
      filteredRows.forEach((filtered) => {
        if (rowIsNotIncluded(filtered.rowInfo.id)) {
          newRows.push({
            ...filtered.rowInfo,
          });
        }
      });

      return [...prevState, ...newRows];
    });
  };

  const handleBulkSelect = () => {
    setCheckedRows(
      rows.map((row) => ({
        ...row.rowInfo,
      }))
    );
  };

  const handleNoneSelect = () => {
    setCheckedRows([]);
  };

  const loadingRows = (perPage) =>
    [...Array(skeletonRowQuantity ?? perPage)].map(() => ({
      cells: columnNames.map(() => ({ title: <Skeleton width="100%" /> })),
    }));

  const emptyFilterView = () => {
    hasCheckbox = false;
    return [
      {
        heightAuto: true,
        cells: [
          {
            props: {
              colSpan: 8,
            },
            title: (
              <CustomEmptyState
                data-testid="general-table-empty-state-no-match"
                bgColor="white"
                icon={emptyFilterState?.icon ?? 'search'}
                title={emptyFilterState?.title ?? 'No match found'}
                body={emptyFilterState?.body ?? ''}
                secondaryActions={
                  toggleAction
                    ? []
                    : [
                        {
                          title: 'Clear all filters',
                          onClick: () =>
                            setFilterValues(createFilterValues(filters)),
                        },
                      ]
                }
              />
            ),
          },
        ],
      },
    ];
  };

  const tableRows = isLoading
    ? loadingRows(perPage)
    : !filteredRows?.length > 0
    ? emptyFilterView()
    : hasCheckbox
    ? checkboxRows()
    : filteredRows;

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
        kebabItems={kebabItems}
      >
        {!isLoading && hasCheckbox && (
          <BulkSelect
            checkedRows={checkedRows}
            handleBulkSelect={handleBulkSelect}
            handlePageSelect={handlePageSelect}
            handleNoneSelect={handleNoneSelect}
            displayedRowsLength={filteredRows.length}
          />
        )}
      </ToolbarHeader>
      <Table
        data-testid="general-table-testid"
        variant="compact"
        aria-label="General Table Component"
        sortBy={hasCheckbox ? { ...sortBy, index: sortBy.index + 1 } : sortBy}
        onSort={handleSort}
        actionResolver={actionResolver ? actionResolver : null}
        areActionsDisabled={areActionsDisabled}
        cells={columns}
        rows={tableRows}
        onSelect={!isLoading && hasCheckbox && handleSelect}
        canSelectAll={false}
      >
        <TableHeader />
        <TableBody />
      </Table>
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
  toggleButton: PropTypes.array,
  toggleAction: PropTypes.func,
  toggleState: PropTypes.number,
  hasCheckbox: PropTypes.bool,
  skeletonRowQuantity: PropTypes.number,
  emptyFilterState: PropTypes.object,
  selectedItems: PropTypes.func,
  kebabItems: PropTypes.array,
  hasModalSubmitted: PropTypes.bool,
  setHasModalSubmitted: PropTypes.func,
  initSelectedItems: PropTypes.array,
  isUseApi: PropTypes.bool,
};

GeneralTable.defaultProps = {
  hasModalSubmitted: false,
  setHasModalSubmitted: () => {},
};

export default GeneralTable;
