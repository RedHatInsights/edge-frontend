import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';
import { useHistory, useNavigate } from 'react-router-dom';
import { Text, Tooltip } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import Status from '../../components/Status';
import { imageTypeMapper } from '../../constants';
import { getImageSetViewVersions } from '../../api/images';
import { cellWidth } from '@patternfly/react-table';
import { createLink, truncateString } from '../../utils';
import useApi from '../../hooks/useApi';
import { getBaseURLFromPrefixAndName } from './utils';

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

const createRows = (
  data,
  imageSetId,
  latestImageVersion,
  pathPrefix,
  urlName,
  history,
  navigate
) => {
  const baseURL = getBaseURLFromPrefixAndName(
    `edge${paths.manageImages}`,
    pathPrefix,
    urlName
  );

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
        title: createLink({
          pathname: `${baseURL}/${imageSetId}/versions/${image.ID}/details`,
          linkText: image?.Version,
          history,
          navigate,
        }),
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

const ImageVersionsTab = ({
  pathPrefix,
  urlName,
  navigateProp,
  historyProp,
  locationProp,
  imageData,
  openUpdateWizard,
}) => {
  const imageSetID = imageData?.data?.ImageSet?.ID;
  const latestImageVersion = imageData?.data?.ImageSet?.Version;

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

  const [response, fetchImageSetVersions] = useApi({
    api: ({ query }) =>
      getImageSetViewVersions({
        imageSetID: imageSetID,
        query,
      }),
    tableReload: true,
  });

  const { data, isLoading, hasError } = response;

  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData.rowInfo?.isoURL) {
      actionsArray.push({
        title: 'Download',
        onClick: (_event, _rowId, rowData) => {
          window.open(rowData.rowInfo.isoURL);
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
    <section className="add-100vh pf-l-page__main-section pf-c-page__main-section">
      <GeneralTable
        navigateProp={navigateProp}
        historyProp={historyProp}
        locationProp={locationProp}
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
        rows={createRows(
          data?.data,
          imageSetID,
          latestImageVersion,
          pathPrefix,
          urlName,
          history,
          navigate
        )}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
        defaultSort={{ index: 3, direction: 'desc' }}
      />
    </section>
  );
};
ImageVersionsTab.propTypes = {
  pathPrefix: PropTypes.string,
  urlName: PropTypes.string,
  navigateProp: PropTypes.func,
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  imageSetID: PropTypes.number,
  createRows: PropTypes.func,
  openUpdateWizard: PropTypes.func,
};

export default ImageVersionsTab;
