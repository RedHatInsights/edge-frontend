import React, { useEffect, useState } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { Text } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { imageTypeMapper } from '../ImageManagerDetail/constants';
import { loadImageSetDetail } from '../../store/actions';
import { cellWidth } from '@patternfly/react-table';

const defaultFilters = [
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
  { title: 'Version', type: 'version', sort: true, columnTransforms: [cellWidth(15)] },
  { title: 'Output', type: 'image_type', sort: false, columnTransforms: [cellWidth(35)] },
  { title: 'Created', type: 'created_at', sort: true, columnTransforms: [cellWidth(25)] },
  { title: 'Status', type: 'status', sort: false, columnTransforms: [cellWidth(35)] },
];

const createRows = (data, imageSetId) => {
  return data?.map(({ image }) => ({
    id: image?.ID,
    noApiSortFilter: [
      image?.Version,
      imageTypeMapper[image?.ImageType],
      image?.CreatedAt,
      image?.Status,
    ],
    cells: [
      {
        title: (
          <Link to={`${paths['manage-images']}/${imageSetId}/${image.ID}`}>
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
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (imageData?.data) {
      setRows(
        createRows(
          imageData?.data?.Data?.images,
          imageData?.data?.Data?.image_set?.ID
        )
      );
    }
  }, [imageData]);

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

    if (
      rowData?.imageStatus === 'SUCCESS' ||
      rowData?.imageStatus === 'ERROR'
    ) {
      actionsArray.push({
        title: 'Update Image',
        onClick: (_event, _rowId, rowData) => {
          openUpdateWizard(rowData.id);
        },
      });
    }

    if (rowData?.imageStatus === 'BUILDING' && rowData?.id) {
      actionsArray.push({
        title: '',
      });
    }

    return actionsArray;
  };

  const areActionsDisabled = (rowData) => rowData?.imageStatus === 'BUILDING';

  return (
    <GeneralTable
      apiFilterSort={false}
      filters={defaultFilters}
      loadTableData={loadImageSetDetail}
      tableData={{
        count: imageData?.data?.Count,
        isLoading: imageData?.isLoading,
        hasError: imageData?.hasError,
      }}
      columnNames={columnNames}
      rows={rows || []}
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
