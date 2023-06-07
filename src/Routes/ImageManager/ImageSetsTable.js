import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';
import { createLink } from '../../utils';
import { Tooltip } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { cellWidth } from '@patternfly/react-table';
import CustomEmptyState from '../../components/Empty';
import { useLocation, useHistory, useNavigate } from 'react-router-dom';
import { emptyStateNoFilters } from '../../utils';
import Status from '../../components/Status';

const TooltipSelectorRef = ({ index }) => (
  <div>
    <Tooltip
      content={<div>More options</div>}
      reference={() =>
        document.getElementById(`pf-dropdown-toggle-id-${index}`)
      }
    />
  </div>
);

TooltipSelectorRef.propTypes = {
  index: PropTypes.number,
};

const defaultFilters = [
  {
    label: 'Name',
    type: 'text',
  },
  {
    label: 'Status',
    type: 'checkbox',
    options: [
      { option: 'Building', value: 'BUILDING' },
      { option: 'Created', value: 'CREATED' },
      { option: 'Error', value: 'ERROR' },
      { option: 'Ready', value: 'SUCCESS' },
    ],
  },
];

const columnNames = [
  {
    title: 'Name',
    type: 'name',
    sort: true,
    columnTransforms: [cellWidth(35)],
  },
  {
    title: 'Current version',
    type: 'version',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Last updated',
    type: 'updated_at',
    sort: true,
    columnTransforms: [cellWidth(25)],
  },
  {
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(30)],
  },
];

const createRows = (data,  history, navigate) => {
  return data.map((image_set, index) => ({
    rowInfo: {
      id: image_set?.ID,
      imageStatus: image_set?.Status,
      isoURL: image_set?.ImageBuildIsoURL || null,
      latestImageID: image_set?.ImageID,
    },
    cells: [
      {
        title: createLink({
          pathname: `${paths.manageImages}/${image_set?.ID}`,
          linkText: image_set?.Name,
          history,
          navigate
        }),
      },

      image_set?.Version,
      {
        title: image_set?.UpdatedAt ? (
          <DateFormat date={image_set?.UpdatedAt} />
        ) : (
          'Unknown'
        ),
      },
      {
        title: (
          <>
            {/* workaround for tooltip on kebab*/}
            <TooltipSelectorRef index={index} />
            <Status type={image_set?.Status.toLowerCase()} />
          </>
        ),
      },
    ],
  }));
};

const ImageTable = ({
  historyProp,
  locationProp,
  navigateProp,
  data,
  count,
  isLoading,
  hasError,
  fetchImageSets,
  openCreateWizard,
  openUpdateWizard,
  hasModalSubmitted,
  setHasModalSubmitted,
}) => {
  // const { search } = locationProp ? locationProp() : useLocation();
  const { pathname, search } = locationProp
    ? locationProp()
    : useLocation
    ? useLocation()
    : null;
  const history = historyProp
  ? historyProp()
  : useHistory
  ? useHistory()
  : null;
  const navigate = navigateProp
    ? navigateProp()
    : useNavigate
    ? useNavigate()
    : null;
  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData.rowInfo?.isoURL) {
      actionsArray.push({
        title: 'Download',
        onClick: (_event, _rowId, rowData) => {
          window.open(rowData.rowInfo?.isoURL);
        },
      });
    }

    if (
      rowData.rowInfo?.imageStatus === 'SUCCESS' ||
      rowData.rowInfo?.imageStatus === 'ERROR'
    ) {
      actionsArray.push({
        title: 'Update Image',
        onClick: (_event, _rowId, rowData) => {
          openUpdateWizard(rowData.rowInfo?.latestImageID);
        },
      });
    }

    if (rowData.rowInfo?.imageStatus === 'BUILDING' && rowData.rowInfo?.id) {
      actionsArray.push({
        title: '',
      });
    }

    return actionsArray;
  };

  const areActionsDisabled = (rowData) =>
    rowData.rowInfo?.imageStatus === 'BUILDING';

  return (
    <>
      {emptyStateNoFilters(isLoading, count, search) ? (
        <CustomEmptyState
          data-testid="general-table-empty-state-no-data"
          icon={'plus'}
          title={'No images found'}
          body={''}
          primaryAction={{
            click: openCreateWizard,
            text: 'Create new image',
          }}
          secondaryActions={[]}
        />
      ) : (
        <GeneralTable
          apiFilterSort={true}
          historyProp={historyProp}
          locationProp={locationProp}
          navigateProp={navigateProp}
          isUseApi={true}
          filters={defaultFilters}
          loadTableData={fetchImageSets}
          tableData={{ count, data, isLoading, hasError }}
          columnNames={columnNames}
          rows={data ? createRows(data, history, navigate) : []}
          actionResolver={actionResolver}
          areActionsDisabled={areActionsDisabled}
          defaultSort={{ index: 2, direction: 'desc' }}
          toolbarButtons={[
            {
              title: 'Create new image',
              click: () => openCreateWizard(),
            },
          ]}
          hasModalSubmitted={hasModalSubmitted}
          setHasModalSubmitted={setHasModalSubmitted}
        />
      )}
    </>
  );
};

ImageTable.propTypes = {
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
  data: PropTypes.array,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  fetchImageSets: PropTypes.func,
  clearFilters: PropTypes.func,
  openCreateWizard: PropTypes.func,
  openUpdateWizard: PropTypes.func,
  filters: PropTypes.array,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
  hasModalSubmitted: PropTypes.bool,
  setHasModalSubmitted: PropTypes.func,
};

export default ImageTable;
