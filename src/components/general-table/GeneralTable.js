import React, { useState, useEffect, useContext } from 'react';
import ToolbarHeader from './ToolbarHeader';
import ToolbarFooter from './ToolbarFooter';
import createFilterValues from '../../components/general-table/createFilterValues';
import { ImageContext } from '../../utils/imageContext';
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
import { transformSort } from '../../utils';
import BulkSelect from './BulkSelect';
import { stateToUrlSearch } from '../../utils';

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
  // historyProp,
  // locationProp,
  // navigateProp,
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
  hasRadio = false,
  setRadioSelection,
  isFooterFixed = false,
}) => {
  const defaultCheckedRows = initSelectedItems ? initSelectedItems : [];
  const [filterValues, setFilterValues] = useState(createFilterValues(filters));
  const [chipsArray, setChipsArray] = useState([]);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
  const [checkedRows, setCheckedRows] = useState(defaultCheckedRows);
  const dispatch = useDispatch();
  const imageContext = useContext(ImageContext);
  //const { search } = location();
  // const location = useLocation();
  // const { pathname, search } = location;

  useEffect(() => {
    // Add or remove has_filters param depending on whether filters are present
    if (
      !imageContext?.location?.search.includes('create_image=true') &&
      !imageContext?.location?.search.includes('update_image=true')
    ) {
      const param = {
        pathname: imageContext?.location?.pathname,
        search: stateToUrlSearch(
          'has_filters=true',
          chipsArray?.length > 0,
          imageContext?.location?.search
        ),
      };
      if (imageContext.navigate) {
        imageContext?.navigate?.({ ...param, replace: true });
      } else {
        imageContext?.history?.replace(param);
      }
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

    if (query?.status === 'updateAvailable') {
      delete query.status;
      query.update_available = 'true';
    }

    if (isUseApi) {
      loadTableData && loadTableData(query);
      return;
    }

    apiFilterSort && urlParam
      ? loadTableData(dispatch, urlParam, query)
      : apiFilterSort
      ? loadTableData(dispatch, query)
      : null;
  }, [chipsArray, perPage, page, sortBy, hasModalSubmitted]);

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
                  columnNames.findIndex((row) => row.title === filter.label) - 1
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
    index = hasCheckbox ? index - 1 : index;
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

  const onSelect = () => {
    if (isLoading) {
      return null;
    }

    if (hasCheckbox) {
      // change to handleCheckboxSelect
      return handleSelect;
    }

    if (hasRadio) {
      return (_event, _isSelecting, rowIndex) => {
        const versionData = tableRows[rowIndex];
        setRadioSelection(versionData);
      };
    }
  };

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
        {!isLoading && hasCheckbox ? (
          <BulkSelect
            checkedRows={checkedRows}
            handleBulkSelect={handleBulkSelect}
            handlePageSelect={handlePageSelect}
            handleNoneSelect={handleNoneSelect}
            displayedRowsLength={filteredRows.length}
          />
        ) : null}
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
        onSelect={onSelect()}
        canSelectAll={false}
        selectVariant={hasRadio ? 'radio' : hasCheckbox ? 'checkbox' : ''}
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
        isFooterFixed={isFooterFixed}
      />
    </>
  );
};

GeneralTable.propTypes = {
  // historyProp: PropTypes.func,
  // locationProp: PropTypes.func,
  // navigateProp: PropTypes.func,
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
  hasToolbar: PropTypes.bool,
  hasRadio: PropTypes.bool,
  setRadioSelection: PropTypes.func,
  isFooterFixed: PropTypes.bool,
};

GeneralTable.defaultProps = {
  hasModalSubmitted: false,
  setHasModalSubmitted: () => {},
};

export default GeneralTable;
