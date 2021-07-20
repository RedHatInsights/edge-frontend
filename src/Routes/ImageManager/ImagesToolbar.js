import React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import {
  isEmptyFilters,
  constructActiveFilters,
  onDeleteFilter,
} from '../../constants';
import { Button } from '@patternfly/react-core';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const ImageToolbar = ({
  setPagination,
  pagination,
  filterConfig,
  activeFilters,
  dispatchActiveFilters,
  defaultFilters,
  openCreateWizard,
}) => {
  const { isLoading } = useSelector(
    ({ edgeImagesReducer }) => ({
      isLoading:
        edgeImagesReducer?.isLoading === undefined
          ? true
          : edgeImagesReducer.isLoading,
    }),
    shallowEqual
  );

  return (
    <PrimaryToolbar
      filterConfig={filterConfig}
      pagination={{
        itemCount: 100,
        ...pagination,
        onSetPage: (_evt, newPage) => setPagination({ page: newPage }),
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
        <Button onClick={openCreateWizard} isDisabled={isLoading !== false}>
          Create new image
        </Button>
      }
    />
  );
};

ImageToolbar.propTypes = {
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
  openCreateWizard: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
};

export default ImageToolbar;
