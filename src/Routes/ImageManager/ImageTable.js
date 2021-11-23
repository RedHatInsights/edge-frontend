import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { Text } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import {
  imageTypeMapper,
  distributionMapper,
} from '../ImageManagerDetail/constants';
import { loadEdgeImages } from '../../store/actions';

const defaultFilters = [
  {
    label: 'Name',
    type: 'text',
  },
  {
    label: 'Distribution',
    type: 'checkbox',
    options: [{ option: 'RHEL 8.4', optionApiName: 'rhel-84' }],
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
  { title: 'Version', type: 'version', sort: false },
  { title: 'Distribution', type: 'distribution', sort: true },
  { title: 'Type', type: 'image_type', sort: false },
  { title: 'Created', type: 'created_at', sort: true },
  { title: 'Status', type: 'status', sort: true },
];

const createRows = (data) => {
  return data.map((image) => ({
    id: image.ID,
    cells: [
      {
        title: (
          <Link to={`${paths['manage-images']}/${image.ID}`}>{image.Name}</Link>
        ),
      },
      image?.Version,
      {
        title: distributionMapper[image?.Distribution],
      },
      {
        title: imageTypeMapper[image?.ImageType],
      },
      {
        title: <DateFormat date={image?.CreatedAt} />,
      },
      {
        title: <StatusLabel status={image?.Status} />,
      },
    ],
    imageStatus: image?.Status,
    isoURL: image?.Installer?.ImageBuildISOURL,
  }));
};

const ImageTable = ({ openCreateWizard, openUpdateWizard }) => {
  const { count, data, isLoading, hasError } = useSelector(
    ({ edgeImagesReducer }) => ({
      count: edgeImagesReducer?.data?.count || 0,
      data: edgeImagesReducer?.data?.data || null,
      isLoading:
        edgeImagesReducer?.isLoading === undefined
          ? true
          : edgeImagesReducer.isLoading,
      hasError: edgeImagesReducer?.hasError,
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

    actionsArray.push({
      title: 'Update Image',
      onClick: (_event, _rowId, rowData) => {
        openUpdateWizard(rowData.id);
      },
    });
    return actionsArray;
  };

  return (
    <GeneralTable
      apiFilterSort={true}
      filters={defaultFilters}
      loadTableData={loadEdgeImages}
      tableData={{ count, data, isLoading, hasError }}
      columnNames={columnNames}
      rows={data ? createRows(data) : []}
      emptyStateMessage="No images found"
      emptyStateActionMessage="Create new image"
      emptyStateAction={openCreateWizard}
      actionResolver={actionResolver}
      areActionsDisabled={() => false}
      defaultSort={{ index: 4, direction: 'desc' }}
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
