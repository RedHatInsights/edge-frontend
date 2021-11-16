import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { Text } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { loadEdgeImageSets } from '../../store/actions';

const defaultFilters = [
  {
    label: 'Name',
    type: 'text',
  },
  {
    label: 'Status',
    type: 'checkbox',
    options: [
      { option: 'CREATED' },
      { option: 'BUILDING' },
      { option: 'ERROR' },
      { option: 'SUCCESS' },
    ],
  },
];

const columnNames = [
  { title: 'Name', type: 'name', sort: true },
  { title: 'Current Version', type: 'version', sort: false },
  { title: 'Last Updated', type: 'updated_at', sort: true },
  { title: 'Status', type: 'status', sort: false },
];

const createRows = (data) => {
  return data.map(({ ID, Name, Version, UpdatedAt, Images }) => ({
    id: ID,
    cells: [
      {
        title: <Link to={`${paths['manage-images']}/${ID}`}>{Name}</Link>,
      },
      Version,

      {
        title: <DateFormat date={UpdatedAt} />,
      },
      {
        title: <StatusLabel status={Images[Images.length - 1].Status} />,
      },
    ],
    imageStatus: Images[Images.length - 1].Status,
    //isoURL: ,
    latestImageID: Images[Images.length - 1].ID,
  }));
};

const ImageTable = ({ openCreateWizard, openUpdateWizard }) => {
  const { count, data, isLoading, hasError } = useSelector(
    ({ edgeImageSetsReducer }) => ({
      count: edgeImageSetsReducer?.data?.Count || 0,
      data: edgeImageSetsReducer?.data?.Data || null,
      isLoading:
        edgeImageSetsReducer?.isLoading === undefined
          ? true
          : edgeImageSetsReducer.isLoading,
      hasError: edgeImageSetsReducer?.hasError,
    }),
    shallowEqual
  );

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
          openUpdateWizard(rowData.latestImageID);
        },
      });
    }

    if (rowData?.imageStatus !== 'SUCCESS' && rowData?.id) {
      actionsArray.push({
        title: '',
      });
    }

    return actionsArray;
  };

  const areActionsDisabled = (rowData) => rowData?.imageStatus !== 'SUCCESS';

  return (
    <GeneralTable
      apiFilterSort={true}
      filters={defaultFilters}
      loadTableData={loadEdgeImageSets}
      tableData={{ count, data, isLoading, hasError }}
      columnNames={columnNames}
      rows={data ? createRows(data) : []}
      emptyStateMessage="No images found"
      emptyStateActionMessage="Create new image"
      emptyStateAction={openCreateWizard}
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
