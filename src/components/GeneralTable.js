import React, { Fragment, useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
} from '@patternfly/react-table';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
  Button,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import {
  isEmptyFilters,
  constructActiveFilters,
  onDeleteFilter,
} from '../constants';
import { useDispatch } from 'react-redux';
import { PlusCircleIcon, SearchIcon } from '@patternfly/react-icons';
import {
  transformFilters,
  transformPaginationParams,
  transformSort,
} from '../Routes/ImageManager/constants';
import PropTypes from 'prop-types';

const GeneralTable = ({
  tableData,
  columnNames,
  createRows,
  emptyStateMessage,
  emptyStateActionMessage,
  emptyStateAction,
  defaultSort,
  loadTableData,
  filters,
  filterDep,
  clearFilters,
  actionResolver,
  areActionsDisabled,
  filterConfig,
  activeFilters,
  dispatchActiveFilters,
  defaultFilters,
  perPage
}) => {
  const [sortBy, setSortBy] = useState(defaultSort);
  const [pagination, setPagination] = useState({ page: 1, perPage });
  const dispatch = useDispatch();

  const columns = columnNames.map((columnName) => ({
    title: columnName.title,
    type: columnName.type,
    transforms: toShowSort ? [] : columnName.sort ? [sortable] : [],
  }));

  const { count, data, isLoading, hasError } = tableData;

  const toShowSort = isLoading || hasError || (!count?.length && hasFilters);
  useEffect(() => {
    loadTableData(dispatch, {
      ...transformFilters(filters),
      ...transformPaginationParams(pagination),
      ...transformSort({
        direction: sortBy.direction,
        name: columns[sortBy.index].type,
      }),
    });
  }, [
    pagination.perPage,
    pagination.page,
    sortBy.index,
    sortBy.direction,
    ...filterDep,
  ]);

  const hasFilters = Object.keys(filters).some((filterKey) => filterKey);

  let rows = [
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

  if (isLoading === false && hasError === false) {
    if (!count?.length && !hasFilters) {
      rows = [
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 8 },
              title: (
                <Bullseye>
                  <EmptyState variant="small">
                    <EmptyStateIcon icon={PlusCircleIcon} />
                    <Title headingLevel="h2" size="lg">
                      {emptyStateMessage}
                    </Title>
                    {emptyStateActionMessage ? (
                      <Button
                        onClick={emptyStateAction}
                        isDisabled={isLoading !== false}
                      >
                        {emptyStateActionMessage}
                      </Button>
                    ) : null}
                  </EmptyState>
                </Bullseye>
              ),
            },
          ],
        },
      ];
    }
    if (!count?.length && hasFilters) {
      rows = [
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 8 },
              title: (
                <Bullseye>
                  <EmptyState variant="small">
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      No match found
                    </Title>
                    <EmptyStateSecondaryActions>
                      <Button onClick={clearFilters} variant="link">
                        Clear all filters
                      </Button>
                    </EmptyStateSecondaryActions>
                  </EmptyState>
                </Bullseye>
              ),
            },
          ],
        },
      ];
    }

    if (data?.length) {
      rows = createRows(data);
    }
  }

  const handleSort = (_event, index, direction) => {
    setSortBy({ index, direction });
  };

  return (
    <Fragment>
      <PrimaryToolbar
        filterConfig={filterConfig}
        pagination={{
          itemCount: count,
          ...pagination,
          onSetPage: (_evt, newPage) =>
            setPagination({ ...pagination, page: newPage }),
          onPerPageSelect: (_evt, newPerPage) =>
            setPagination({ page: 1, perPage: newPerPage }),
        }}
        activeFiltersConfig={{
          filters: isEmptyFilters(activeFilters)
            ? constructActiveFilters(activeFilters)
            : [],
          onDelete: (_event, itemsToRemove, isAll) => {
            if (isAll) {
              dispatchActiveFilters({
                type: 'DELETE_FILTER',
                payload: defaultFilters,
              });
            } else {
              dispatchActiveFilters({
                type: 'DELETE_FILTER',
                payload: onDeleteFilter(activeFilters, itemsToRemove),
              });
            }
          },
        }}
        dedicatedAction={
          <Button onClick={emptyStateAction} isDisabled={isLoading !== false}>
            {emptyStateActionMessage}
          </Button>
        }
      />
      <Table
        variant="compact"
        aria-label="Manage Images table"
        sortBy={sortBy}
        onSort={handleSort}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
        cells={columns}
        rows={rows}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </Fragment>
  );
};

GeneralTable.propTypes = {
  tableData: PropTypes.object.isRequired,
  columnNames: PropTypes.array.isRequired,
  createRows: PropTypes.func.isRequired,
  emptyStateMessage: PropTypes.string.isRequired,
  emptyStateActionMessage: PropTypes.string,
  emptyStateAction: PropTypes.func,
  defaultSort: PropTypes.object.isRequired,
  clearFilters: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  loadTableData: PropTypes.func.isRequired,
  filterDep: PropTypes.array.isRequired,
  actionResolver: PropTypes.func.isRequired,
  areActionsDisabled: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
  setPagination: PropTypes.func.isRequired,
  filterConfig: PropTypes.shape({ items: PropTypes.array }),
  defaultFilters: PropTypes.shape({
    name: PropTypes.object,
    distribution: PropTypes.object,
    status: PropTypes.object,
  }),
  activeFilters: PropTypes.shape({
    name: PropTypes.object,
    distribution: PropTypes.object,
    status: PropTypes.object,
  }),
  dispatchActiveFilters: PropTypes.func.isRequired,
};

export default GeneralTable;
