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
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  Spinner,
} from '@patternfly/react-core';
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
                filter.apiName ? filter.apiName : filter.label,
              ],
            };
          } else {
            return {
              ...acc,
              [filter.key.toLowerCase()]: filter.apiName
                ? filter.apiName
                : filter.label,
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
}) => {
  const [filterValues, setFilterValues] = useState(createFilterValues(filters));
  const [chipsArray, setChipsArray] = useState([]);
  const [sortBy, setSortBy] = useState(defaultSort);
  const [perPage, setPerPage] = useState(20);
  const [page, setPage] = useState(1);
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
    const repoFilter = filterValues.find((filter) => filter?.label === 'Name');
    return rows.filter((repo) => {
      return repoFilter
        ? repo.rowName.toLowerCase().includes(repoFilter.value.toLowerCase())
        : repo;
    });
  };

  const filteredByNameRows = !apiFilterSort && filteredByName();

  //non-api sort function
  const sortedByDirection = (rows) =>
    rows.sort((a, b) =>
      sortBy.direction === 'asc'
        ? a.rowName.toLowerCase().localeCompare(b.rowName.toLowerCase())
        : b.rowName.toLowerCase().localeCompare(a.rowName.toLowerCase())
    );

  const nonApiCount = !apiFilterSort
    ? sortedByDirection(filteredByNameRows).length
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
  }));

  const filteredRows = apiFilterSort
    ? rows
    : sortedByDirection(filteredByNameRows).slice(
        (page - 1) * perPage,
        (page - 1) * perPage + perPage
      );

  const loadingRows = [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan: 8 },
          title: (
            <Bullseye>
              <EmptyState variant="small">
                <EmptyStateIcon icon={Spinner} />
              </EmptyState>
            </Bullseye>
          ),
        },
      ],
    },
  ];

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
      />
      {!isLoading && !count > 0 ? (
        <CustomEmptyState
          data-testid="general-table-empty-state-no-data"
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
      ) : !isLoading && !filteredRows.length > 0 ? (
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
          rows={isLoading ? loadingRows : filteredRows}
        >
          <TableHeader />
          <TableBody />
        </Table>
      )}

      <ToolbarFooter
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
};

export default GeneralTable;
