import React, { useState } from 'react';
import ToolbarHeader from './ToolbarHeader';
import ToolbarFooter from './ToolbarFooter';
import createFilterValues from '../../components/generalTable/createFilterValues';

import {
  Table,
  TableHeader,
  TableBody,
  sortable,
} from '@patternfly/react-table';
import PropTypes from 'prop-types';
import EmptyState from './Empty';

const GeneralTable = ({
  apiFilterSort,
  filters,
  tableData,
  columnNames,
  rows,
  toolbarButtons,
  actionResolver,
  areActionsDisabled,
  defaultSort,
}) => {
  const [filterValues, setFilterValues] = useState(createFilterValues(filters));
  const [sortBy, setSortBy] = useState(defaultSort);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

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

  //non-api sort function
  const sortedByDirection = (rows) =>
    rows.sort((a, b) =>
      sortBy.direction === 'asc'
        ? a.rowName.toLowerCase().localeCompare(b.rowName.toLowerCase())
        : b.rowName.toLowerCase().localeCompare(a.rowName.toLowerCase())
    );

  const nonApiCount = !apiFilterSort
    ? sortedByDirection(filteredByName()).length
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
    : sortedByDirection(filteredByName()).slice(
        (page - 1) * perPage,
        (page - 1) * perPage + perPage
      );

  return (
    <>
      <ToolbarHeader
        count={apiFilterSort ? count : nonApiCount}
        toolbarButtons={toolbarButtons}
        filters={filters}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        perPage={perPage}
        setPerPage={setPerPage}
        page={page}
        setPage={setPage}
      />
      {filteredRows.length > 0 ? (
        <Table
          variant="compact"
          aria-label="Manage Images table"
          sortBy={sortBy}
          onSort={handleSort}
          actionResolver={actionResolver ? actionResolver : null}
          areActionsDisabled={areActionsDisabled}
          cells={columns}
          rows={filteredRows}
        >
          <TableHeader />
          <TableBody />
        </Table>
      ) : (
        <EmptyState
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
  filters: PropTypes.func,
  tableData: PropTypes.array,
  columnNames: PropTypes.array,
  rows: PropTypes.array,
  actionResolver: PropTypes.array,
  areActionsDisabled: PropTypes.func,
  defaultSort: PropTypes.object,
  toolbarButtons: PropTypes.array,
};

export default GeneralTable;
