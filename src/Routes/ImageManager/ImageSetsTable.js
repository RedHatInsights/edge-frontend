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
import { getBaseURLFromPrefixAndName } from '../ImageManagerDetail/utils';
import { distributionMapper } from '../../constants';

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
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Version',
    type: 'version',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Release',
    type: 'distribution',
    options: distributionMapper,
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Target',
    type: 'outputTypes',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Created/Updated',
    type: 'updated_at',
    sort: true,
    columnTransforms: [cellWidth(35)],
  },
];
const createRows = (data, baseURL, history, navigate) => {
  return data.map((image_set, index) => ({
    rowInfo: {
      id: image_set?.ID,
      imageStatus: image_set?.Status,
      distribution: image_set?.Distribution,
      outputType: image_set?.OutputTypes,
      isoURL: image_set?.ImageBuildIsoURL || null,
      latestImageID: image_set?.ImageID,
    },
    cells: [
      {
        title: createLink({
          pathname: `${baseURL}/${image_set?.ID}`,
          linkText: image_set?.Name,
          history,
          navigate,
        }),
      },

      image_set?.Version,
      {
        title: distributionMapper[image_set?.Distribution],
      },
      image_set?.OutputTypes.length == 2
        ? 'Bare Metal Installer'
        : 'Update Only',
      {
        title: (
          <>
            {/* workaround for tooltip on kebab*/}
            <TooltipSelectorRef index={index} />
            <Status type={image_set?.Status.toLowerCase()} />
          </>
        ),
      },
      {
        title: image_set?.UpdatedAt ? (
          <DateFormat date={image_set?.UpdatedAt} />
        ) : (
          'Unknown'
        ),
      },
    ],
  }));
};

const ImageTable = ({
  pathPrefix,
  urlName,
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
  const { search } = locationProp
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

  const baseURL = getBaseURLFromPrefixAndName(
    paths.manageImages,
    pathPrefix,
    urlName
  );

  return (
    <>
      {emptyStateNoFilters(isLoading, count, search) ? (
        <CustomEmptyState
          data-testid="general-table-empty-state-no-data"
          icon={'plus'}
          title={'Create an OSTree image'}
          body={[
            'Image builder is a tool to compose customized RHEL (rpm-ostree) images optimized for Edge. ',
            'With OSTree, you can manage the system software by referencing a central image repository. ' +
              'Images contain a complete operating system ready to be remotely installed at scale. ' +
              'Updates to images are tracked through commits and enable secure updates that only ' +
              'address changes and keep the operating system unchanged. Image updates are quick, ' +
              'and rollbacks are easy.',
          ]}
          secondaryActions={[
            {
              type: 'link',
              title: 'Learn more about OSTree.',
              link: 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/composing_installing_and_managing_rhel_for_edge_images/index#introducing-rhel-for-edge-images_composing-installing-managing-rhel-for-edge-images',
            },
            {
              variant: 'primary',
              className: 'edge-stretched-button',
              onClick: () => openCreateWizard(),
              type: 'button',
              title: 'Create image.',
            },
            {
              type: 'link',
              iconPosition: 'left',
              title: 'Image builder for OSTree documentation',
              link: 'https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/composing_installing_and_managing_rhel_for_edge_images/index#introducing-rhel-for-edge-images_composing-installing-managing-rhel-for-edge-images',
            },
          ]}
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
          rows={data ? createRows(data, baseURL, history, navigate) : []}
          actionResolver={actionResolver}
          areActionsDisabled={areActionsDisabled}
          defaultSort={{ index: 5, direction: 'desc' }}
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
  pathPrefix: PropTypes.string,
  urlName: PropTypes.string,
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
