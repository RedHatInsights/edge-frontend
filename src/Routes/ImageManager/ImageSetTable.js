import React, { useReducer, useState } from 'react';
import GeneralTable from '../../components/GeneralTable';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { Text } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import {
  composeStatus,
  distributionMapper,
} from '../ImageManagerDetail/constants';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { isEmptyFilters, constructActiveFilters } from '../../constants';
import { loadEdgeImageSets } from '../../store/actions';

const defaultFilters = {
  name: {
    label: 'Name',
    key: 'name',
    value: '',
  },
  distribution: {
    label: 'Distribution',
    key: 'distribution',
    value: [],
  },
  status: {
    label: 'Status',
    key: 'status',
    value: [],
  },
};

const updateFilter = (state, action) => ({
  ...state,
  [action.property]: {
    ...(state[action.property] || {}),
    value: action.value,
  },
});

const deleteFilter = (_state, action) => action.payload;

const activeFilterMapper = {
  UPDATE_FILTER: updateFilter,
  DELETE_FILTER: deleteFilter,
};

const activeFilterReducer = applyReducerHash(
  activeFilterMapper,
  defaultFilters
);

const ImageTable = ({ openCreateWizard, openUpdateWizard }) => {
  const [activeFilters, dispatchActiveFilters] = useReducer(
    activeFilterReducer,
    defaultFilters
  );
  const { count, data, isLoading, hasError } = useSelector(
    ({ edgeImagesReducer }) => ({
      count: edgeImagesReducer?.data?.count,
      data: edgeImagesReducer?.data || null,
      isLoading:
        edgeImagesReducer?.isLoading === undefined
          ? true
          : edgeImagesReducer.isLoading,
      hasError: edgeImagesReducer?.hasError,
    }),
    shallowEqual
  );

  const columnNames = [
    { title: 'Name', type: 'name', sort: true },
    { title: 'Current Version', type: 'version', sort: false },
    { title: 'Last Updated', type: 'created_at', sort: true },
    { title: 'Status', type: 'status', sort: true },
  ];

  const createRows = (data) => {
    return data.map((image) => {
      const currentImage = image?.Images?.[image.Images.length - 1];
      return {
        id: image.ID,
        cells: [
          {
            title: (
              <Link to={`${paths['manage-images']}/${image.ID}`}>
                {image.Name}
              </Link>
            ),
          },
          image?.Version,
          {
            title: <DateFormat date={currentImage?.CreatedAt} />,
          },
          {
            title: <StatusLabel status={currentImage?.Status} />,
          },
        ],
        imageStatus: currentImage?.Status,
        isoURL: currentImage?.Installer?.ImageBuildISOURL,
      };
    });
  };

  const filterConfig = {
    items: [
      {
        label: defaultFilters.name.label,
        type: 'text',
        filterValues: {
          key: 'name-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'name',
              value,
            }),
          value: activeFilters?.name?.value || '',
          placeholder: 'Filter by name',
        },
      },
      {
        label: defaultFilters.distribution.label,
        type: 'checkbox',
        filterValues: {
          key: 'distribution-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'distribution',
              value,
            }),
          items: Object.entries(distributionMapper).map(([value, label]) => ({
            label,
            value,
          })),
          value: activeFilters?.distribution?.value || '',
        },
      },
      {
        label: defaultFilters.status.label,
        type: 'checkbox',
        filterValues: {
          key: 'status-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'status',
              value,
            }),
          items: composeStatus.map((item) => ({
            label: item,
            value: item,
          })),
          value: activeFilters?.status?.value || [],
        },
      },
    ],
  };
  const filterDep = Object.values(activeFilters);

  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData?.isoURL) {
      actionsArray.push({
        title: (
          <Text
            className="force-text-black remove-underline"
            component="a"
            href={rowData.isoURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Download
          </Text>
        ),
      });
    }

    if (rowData?.imageStatus === 'SUCCESS') {
      actionsArray.push({
        title: 'Update Image',
        onClick: (_event, _rowId, rowData) => {
          openUpdateWizard(rowData.id);
        },
      });
    }

    if (rowData?.imageStatus !== 'SUCCESS') {
      actionsArray.push({
        title: '',
      });
    }

    return actionsArray;
  };

  const areActionsDisabled = (rowData) => rowData?.imageStatus !== 'SUCCESS';

  return (
    <GeneralTable
      clearFilters={() =>
        dispatchActiveFilters({
          type: 'DELETE_FILTER',
          payload: defaultFilters,
        })
      }
      tableData={{ count, data, isLoading, hasError }}
      columnNames={columnNames}
      createRows={createRows}
      emptyStateMessage="No images found"
      emptyStateActionMessage="Create new images"
      emptyStateAction={openCreateWizard}
      defaultSort={{ index: 2, direction: 'desc' }}
      loadTableData={loadEdgeImageSets}
      filters={
        isEmptyFilters(activeFilters)
          ? constructActiveFilters(activeFilters)
          : []
      }
      filterDep={filterDep}
      perPage={100}
      actionResolver={actionResolver}
      areActionsDisabled={areActionsDisabled}
      filterConfig={filterConfig}
      activeFilters={activeFilters}
      dispatchActiveFilters={dispatchActiveFilters}
      defaultFilters={defaultFilters}
    />
  );
};

ImageTable.propTypes = {
  clearFilters: PropTypes.func.isRequired,
  openCreateWizard: PropTypes.func.isRequired,
  openUpdateWizard: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
};

export default ImageTable;
