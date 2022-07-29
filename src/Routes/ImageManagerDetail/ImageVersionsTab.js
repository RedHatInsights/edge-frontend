import React, { useEffect, useState } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';
import { Link } from 'react-router-dom';
import { Text, Tooltip } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import Status from '../../components/Status';
import { imageTypeMapper } from '../../constants';
import { getImageSetViewVersions } from '../../api/images';
import { cellWidth } from '@patternfly/react-table';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { truncateString } from '../../utils';
import useApi from '../../hooks/useApi';

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
    title: 'Ostree commit hash',
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
  return data?.map((image) => ({
    rowInfo: {
      id: image?.ID,
      imageStatus: image?.Status,
      isoURL: image?.ImageBuildIsoURL,
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
        title: image?.CommitCheckSum ? (
          <Tooltip content={<div>{image.CommitCheckSum}</div>}>
            <span>{truncateString(image.CommitCheckSum, 5, 5)}</span>
          </Tooltip>
        ) : (
          <Text>Unavailable</Text>
        ),
      },
      {
        title: <DateFormat date={image?.CreatedAt} />,
      },
      {
        title: <Status type={image?.Status.toLowerCase()} />,
      },
    ],
  }));
};

const ImageVersionsTab = ({ imageData, openUpdateWizard }) => {
  const imageSetID = imageData?.data?.ImageSet?.ID;
  const latestImageVersion = imageData?.data?.ImageSet?.Version;
  const [data, setData] = useState(imageData?.data?.ImagesViewData);
  const [isLoading, setIsLoading] = useState(imageData?.isLoading);
  const [hasError, setHasError] = useState(imageData?.hasError);

  const [response, fetchImageSetVersions] = useApi({
    api: ({ query }) =>
      getImageSetViewVersions({
        imageSetID: imageSetID,
        query,
      }),
    tableReload: true,
  });

  useEffect(() => {
    if (!response.isLoading) {
      setData(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (!response.isLoading) {
      setIsLoading(response.isLoading);
    }
  }, [response]);

  useEffect(() => {
    if (!response.isLoading) {
      setHasError(response.hasError);
    }
  }, [response]);

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
        apiFilterSort={true}
        isUseApi={true}
        filters={defaultFilters}
        loadTableData={fetchImageSetVersions}
        tableData={{
          count: data?.count,
          data: data?.data,
          isLoading,
          hasError,
        }}
        columnNames={columnNames}
        rows={createRows(data?.data, imageSetID, latestImageVersion)}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
        defaultSort={{ index: 3, direction: 'desc' }}
      />
    </Main>
  );
};
ImageVersionsTab.propTypes = {
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  imageSetID: PropTypes.number,
  createRows: PropTypes.func,
  openUpdateWizard: PropTypes.func,
};

export default ImageVersionsTab;
