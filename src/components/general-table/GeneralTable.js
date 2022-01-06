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
import { useLocation } from 'react-router-dom';
import { isEqual } from 'lodash';

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

const getParams = (searchURL) => {
  const params = searchURL.slice(1).split('&');
  let obj = {};

  if (params[0] === '') {
    return obj;
  }

  params.forEach((param) => {
    const [key, val] = param.split('=');
    const lowerKey = key.toLowerCase();
    const lowerVal = val.toLowerCase();
    if (obj[key]) {
      obj = {
        ...obj,
        [lowerKey]:
          typeof obj[lowerKey] === 'string'
            ? [obj[lowerKey], lowerVal]
            : [...obj[lowerKey], lowerVal],
      };
    } else {
      obj = {
        ...obj,
        [lowerKey]: lowerVal,
      };
    }
  });
  return obj;
};

const paramFilters = (filters, obj) => {
  return filters.map((filter) => {
    const name = filter.label.toLowerCase();
    if (filter.type === 'text') {
      if (obj[name]) {
        return {
          ...filter,
          value: obj[name],
        };
      }
    }

    if (filter.type === 'checkbox' && obj[name]) {
      return {
        ...filter,
        options: filter.options.map((option) => {
          const value = option.value.toLowerCase();
          if (typeof obj[name] === 'string') obj[name] = [obj[name]];

          if (obj[name].find((item) => item === value)) {
            return {
              ...option,
              isChecked: true,
            };
          } else return option;
        }),
      };
    }
    return filter;
  });
};

const GeneralTable = ({
  apiFilterSort,
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
}) => {
  const { search } = useLocation();
  const [urlParams] = useState(getParams(search));
  const [filterValues, setFilterValues] = useState(
    search[0] === '?'
      ? createFilterValues(paramFilters(filters, urlParams))
      : createFilterValues(filters)
  );

  const [chipsArray, setChipsArray] = useState([]);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [perPage, setPerPage] = useState(urlParams['limit'] || 20);
  const [page, setPage] = useState(urlParams['offset'] || 1);
  const dispatch = useDispatch();

  useEffect(() => {
    const upperUrlParams = {
      status: urlParams?.status?.map((p) => p.toUpperCase()),
    };
    const filteredParamChips = filterParams(chipsArray);

    const isUrlAndChipsEqual = isEqual(
      upperUrlParams,
      typeof filteredParamChips.status === 'string'
        ? { status: [filteredParamChips.status] }
        : filteredParamChips
    );

    const additionalParams =
      search[0] === '?' ? upperUrlParams : filteredParamChips;

    const query = apiFilterSort
      ? {
          ...additionalParams,
          limit: perPage,
          offset: (page - 1) * perPage,
          ...transformSort({
            direction: sortBy.direction,
            name: columns[sortBy.index].type,
          }),
        }
      : null;

    apiFilterSort && !isUrlAndChipsEqual
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

  const loadingRows = (perPage) =>
    [...Array(perPage)].map(() => ({
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
          aria-label="Manage Images table"
          sortBy={sortBy}
          onSort={handleSort}
          actionResolver={actionResolver ? actionResolver : null}
          areActionsDisabled={areActionsDisabled}
          cells={columns}
          rows={isLoading ? loadingRows(perPage) : filteredRows}
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
};

export default GeneralTable;
