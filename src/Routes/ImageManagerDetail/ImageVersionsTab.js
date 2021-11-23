import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { Text } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { imageTypeMapper } from '../ImageManagerDetail/constants';
import { loadImageSetDetail } from '../../store/actions';

const defaultFilters = [
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
  { title: 'Version', type: 'version', sort: true },
  { title: 'Output', type: 'image_type', sort: false },
  { title: 'Created', type: 'created_at', sort: true },
  { title: 'Status', type: 'status', sort: false },
];

const createRows = (data) => {
  return data.Images.map((image) => ({
    id: image.ID,
    noApiSortFilter: [
      image?.Version,
      imageTypeMapper[image?.ImageType],
      image?.CreatedAt,
      image?.Status,
    ],
    cells: [
      {
        title: (
          <Link to={`${paths['manage-images-version']}/${image.ID}`}>
            {image?.Version}
          </Link>
        ),
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

const ImageVersionsTab = ({ imageData, openUpdateWizard }) => {
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
      apiFilterSort={false}
      //urlParam={urlParam}
      filters={defaultFilters}
      loadTableData={loadImageSetDetail}
      tableData={{
        count: imageData?.data?.Images?.length,
        data: imageData?.data?.Images,
        isLoading: imageData?.isLoading,
        hasError: imageData?.hasError,
      }}
      columnNames={columnNames}
      rows={imageData?.data ? createRows(imageData?.data) : []}
      actionResolver={actionResolver}
      areActionsDisabled={areActionsDisabled}
      defaultSort={{ index: 2, direction: 'desc' }}
    />
  );
};
ImageVersionsTab.propTypes = {
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  openUpdateWizard: PropTypes.func,
};

export default ImageVersionsTab;
