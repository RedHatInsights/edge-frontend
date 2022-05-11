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
import Main from '@redhat-cloud-services/frontend-components/Main';

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
    columnTransforms: [cellWidth(35)],
  },
  {
    title: 'Created',
    type: 'created_at',
    sort: true,
    columnTransforms: [cellWidth(25)],
  },
  {
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(35)],
  },
];

const createRows = (data, imageSetId) => {
  return data?.map(({ image }) => ({
    rowInfo: {
      id: image?.ID,
      imageStatus: image?.Status,
      isoURL: image?.Installer?.ImageBuildISOURL,
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
        title: <DateFormat date={image?.CreatedAt} />,
      },
      {
        title: <StatusLabel status={image?.Status} />,
      },
    ],
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
    let imageLatestVersion = imageData?.data?.Data?.images?.[0].image?.Version;

    const areActionsDisabledForNonLatestImageVersion = (imageData) => {
      for (let i = 0; i < imageLatestVersion; i++) {
        console.log(imageData?.data?.Data?.images?.[i].image?.Version);
        if (
          imageData?.data?.Data?.images?.[i].image?.Version < imageLatestVersion
        ) {
          return true;
        }
      }
    };
    if (
      rowData.rowInfo?.imageStatus === 'SUCCESS' ||
      rowData.rowInfo?.imageStatus === 'ERROR'
    ) {
      actionsArray.push({
        title: 'Update Image',
        isDisabled: areActionsDisabledForNonLatestImageVersion,
        onClick: (_event, _rowId, rowData) => {
          openUpdateWizard(rowData.rowInfo.id);
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
