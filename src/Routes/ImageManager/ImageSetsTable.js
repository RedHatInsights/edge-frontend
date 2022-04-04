import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { Text, Tooltip } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { loadEdgeImageSets } from '../../store/actions';
import { cellWidth } from '@patternfly/react-table';
import CustomEmptyState from '../../components/Empty';
import { useHistory } from 'react-router-dom';
import { emptyStateNoFliters } from '../../constants';

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
    title: 'Current Version',
    type: 'version',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Last Updated',
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

const createRows = (data) => {
  return data.map(({ image_set, image_build_iso_url }, index) => ({
    rowInfo: {
      id: image_set?.ID,
      imageStatus: image_set?.Images[0].Status,
      isoURL: image_build_iso_url || null,
      latestImageID: image_set?.Images[0].ID,
    },
    cells: [
      {
        title: (
          <Link to={`${paths['manage-images']}/${image_set?.ID}`}>
            {image_set?.Name}
          </Link>
        ),
      },
      image_set?.Images[0].Version, // remove when image_set.Version is accurate
      {
        title: <DateFormat date={image_set?.UpdatedAt} />,
      },
      {
        title: (
          <>
            {/* workaround for tooltip on kebab*/}
            <TooltipSelectorRef index={index} />
            <StatusLabel status={image_set?.Images[0].Status} />
          </>
        ),
      },
    ],
  }));
};

const ImageTable = ({ openCreateWizard, openUpdateWizard }) => {
  const { count, data, isLoading, hasError } = useSelector(
    ({ edgeImageSetsReducer }) => ({
      count: edgeImageSetsReducer?.data?.Count || 0,
      data: edgeImageSetsReducer?.data?.Data || [],
      isLoading:
        edgeImageSetsReducer?.isLoading === undefined
          ? true
          : edgeImageSetsReducer.isLoading,
      hasError: edgeImageSetsReducer?.hasError,
    }),
    shallowEqual
  );

  const history = useHistory();

  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData.rowInfo?.isoURL) {
      actionsArray.push({
        title: (
          <Text
            className="force-text-black remove-underline"
            component="a"
            href={rowData.rowInfo?.isoURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Download
          </Text>
        ),
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
      {emptyStateNoFliters(isLoading, count, history) ? (
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
          filters={defaultFilters}
          loadTableData={loadEdgeImageSets}
          tableData={{ count, data, isLoading, hasError }}
          columnNames={columnNames}
          rows={data ? createRows(data) : []}
          actionResolver={actionResolver}
          areActionsDisabled={areActionsDisabled}
          defaultSort={{ index: 2, direction: 'desc' }}
          toolbarButtons={[
            {
              title: 'Create new image',
              click: () => openCreateWizard(),
            },
          ]}
        />
      )}
    </>
  );
};

ImageTable.propTypes = {
  clearFilters: PropTypes.func,
  openCreateWizard: PropTypes.func,
  openUpdateWizard: PropTypes.func,
  filters: PropTypes.array,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }),
};

export default ImageTable;
