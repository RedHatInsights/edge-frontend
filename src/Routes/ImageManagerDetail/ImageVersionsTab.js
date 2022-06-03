import React, { useEffect, useState } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';
import { Link } from 'react-router-dom';
import { Text, Tooltip } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { imageTypeMapper } from '../../constants';
import { loadImageSetDetail } from '../../store/actions';
import { cellWidth } from '@patternfly/react-table';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { truncateString } from '../../utils';

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
  {
    title: 'Version',
    type: 'version',
    sort: true,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Output',
    type: 'image_type',
    sort: false,
    columnTransforms: [cellWidth(25)],
  },
  {
    title: 'Ostree Commit Hash',
    type: 'ostree_commit_hash',
    sort: false,
    columnTransforms: [cellWidth(20)],
  },
  {
    title: 'Created',
    type: 'created_at',
    sort: true,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(35)],
  },
];

const createRows = (data, imageSetId, latestImageVersion) => {
  return data?.map(({ image }) => ({
    rowInfo: {
      id: image?.ID,
      imageStatus: image?.Status,
      isoURL: image?.Installer?.ImageBuildISOURL,
      latestImageVersion,
      currentImageVersion: image.Version,
    },
    noApiSortFilter: [
      image?.Version,
      imageTypeMapper[image?.ImageType],
      image?.CreatedAt,
      image?.Status,
    ],
    cells: [
      {
        title: (
          <Link
            to={`${paths['manage-images']}/${imageSetId}/versions/${image.ID}/details`}
          >
            {image?.Version}
          </Link>
        ),
      },
      {
        title: imageTypeMapper[image?.ImageType],
      },
      {
        title: image?.Commit?.OSTreeCommit ? (
          <Tooltip content={<div>{image?.Commit?.OSTreeCommit}</div>}>
            <span>{truncateString(image?.Commit?.OSTreeCommit, [5, 5])}</span>
          </Tooltip>
        ) : (
          <Text>Unavailable</Text>
        ),
      },
      {
        title: <DateFormat date={image?.CreatedAt} />,
      },
      {
        title: <StatusLabel status={image?.Status} />,
      },
    ],
  }));
};

const ImageVersionsTab = ({ imageData, openUpdateWizard }) => {
  const latestImageVersion = imageData?.data?.Data.image_set.Version;
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (imageData?.data) {
      setRows(
        createRows(
          imageData?.data?.Data?.images,
          imageData?.data?.Data?.image_set?.ID,
          latestImageVersion
        )
      );
    }
  }, [imageData]);

  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData.rowInfo?.isoURL) {
      actionsArray.push({
        title: (
          <Text
            className="force-text-black remove-underline"
            component="a"
            href={rowData.rowInfo.isoURL}
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
          openUpdateWizard(rowData.rowInfo.id);
        },
        isDisabled:
          rowData?.rowInfo?.latestImageVersion !==
          rowData?.rowInfo?.currentImageVersion,
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
    <Main className="add-100vh">
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
    </Main>
  );
};
ImageVersionsTab.propTypes = {
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  openUpdateWizard: PropTypes.func,
};

export default ImageVersionsTab;
