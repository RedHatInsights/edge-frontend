import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { cellWidth } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';
import CustomEmptyState from '../../components/Empty';
import { emptyStateNoFilters } from '../../utils';
import DeviceStatus, { getDeviceStatus } from '../../components/Status';
import RetryUpdatePopover from './RetryUpdatePopover';

const defaultFilters = [
  {
    label: 'Name',
    type: 'text',
  },
  {
    label: 'Status',
    type: 'checkbox',
    options: [
      // { option: 'Booting', value: 'booting' },
      // { option: 'Running', value: 'running' },
      { option: 'Update available', value: 'updateAvailable' },
      // { option: 'Updating', value: 'updating' },
    ],
  },
];

const columnNames = [
  {
    title: 'Name',
    type: 'name',
    sort: true,
    columnTransforms: [cellWidth(30)],
  },
  {
    title: 'Image',
    type: 'image',
    sort: false,
    columnTransforms: [cellWidth(20)],
  },
  {
    title: 'Groups',
    type: 'groups',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Last seen',
    type: 'last_seen',
    sort: true,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(25)],
  },
];

const createRows = (devices, hasLinks, fetchDevices, deviceLinkBase) => {
  return devices?.map((device) => {
    let { DeviceName, DeviceGroups } = device;
    const {
      DeviceID,
      DeviceUUID,
      UpdateAvailable,
      LastSeen,
      ImageName,
      ImageSetID,
      // ImageID,
      Status,
      DispatcherStatus,
    } = device;
    const deviceStatus = getDeviceStatus(
      Status,
      UpdateAvailable,
      DispatcherStatus
    );
    if (DeviceName === '') {
      // needs to be fixed with proper name in sync with inv
      DeviceName = 'localhost';
    }

    if (DeviceGroups === null) {
      DeviceGroups = [];
    }

    const deviceGroupTooltip = (
      <div>
        <Tooltip
          content={
            <div>
              {DeviceGroups.map((group, index) => (
                <p key={index}>{group.Name}</p>
              ))}
            </div>
          }
        >
          <span>Multiple groups</span>
        </Tooltip>
      </div>
    );

    return {
      rowInfo: {
        deviceID: DeviceID,
        id: DeviceUUID,
        display_name: DeviceName,
        updateImageData: UpdateAvailable,
        deviceStatus: getDeviceStatus(
          Status,
          UpdateAvailable,
          DispatcherStatus
        ),
        imageSetId: ImageSetID,
        imageName: ImageName,
        deviceGroups: DeviceGroups,
      },
      noApiSortFilter: [
        DeviceName || '',
        ImageName || '',
        '',
        LastSeen || '',
        getDeviceStatus(Status, UpdateAvailable),
      ],
      cells: [
        {
          title: hasLinks ? (
            <Link
              to={{
                pathname: `${deviceLinkBase}/${DeviceUUID}`,
              }}
            >
              {DeviceName}
            </Link>
          ) : (
            DeviceName
          ),
        },
        {
          title: ImageName ? (
            hasLinks ? (
              <Link to={`${paths.manageImages}/${ImageSetID}`}>
                {ImageName}
              </Link>
            ) : (
              ImageName
            )
          ) : (
            'unavailable'
          ),
        },
        {
          title:
            DeviceGroups.length === 0
              ? '-'
              : DeviceGroups.length === 1
              ? DeviceGroups[0].Name
              : deviceGroupTooltip,
        },
        {
          title: LastSeen ? <DateFormat date={LastSeen} /> : 'Unknown',
        },
        {
          title:
            deviceStatus === 'error' || deviceStatus === 'unresponsive' ? (
              <RetryUpdatePopover
                lastSeen={LastSeen}
                fetchDevices={fetchDevices}
                device={device}
              >
                <DeviceStatus
                  type={
                    deviceStatus === 'error'
                      ? 'errorWithExclamationCircle'
                      : deviceStatus
                  }
                  isLink={true}
                />
              </RetryUpdatePopover>
            ) : (
              <DeviceStatus
                type={
                  deviceStatus === 'error'
                    ? 'errorWithExclamationCircle'
                    : deviceStatus
                }
              />
            ),
        },
      ],
    };
  });
};

const DeviceTable = ({
  historyProp,
  locationProp,
  hasCheckbox = false,
  selectedItems,
  selectedItemsUpdateable,
  skeletonRowQuantity,
  data,
  count,
  isLoading,
  hasError,
  kebabItems,
  setRemoveModal,
  setIsAddModalOpen,
  handleAddDevicesToGroup,
  handleRemoveDevicesFromGroup,
  handleUpdateSelected,
  hasModalSubmitted,
  setHasModalSubmitted,
  fetchDevices,
  isSystemsView = false,
  isAddSystemsView = false,
}) => {
  const canBeRemoved = setRemoveModal;
  const canBeAdded = setIsAddModalOpen;
  const canBeUpdated = isSystemsView;
  const history = historyProp ? historyProp() : useHistory();
  const { pathname, search } = locationProp ? locationProp() : useLocation();

  // Create base URL path for system detail link
  const deviceBaseUrl =
    pathname === paths.inventory ? pathname : `${pathname}/systems`;

  const actionResolver = (rowData) => {
    const actions = [];
    if (isLoading) return actions;
    if (!rowData?.rowInfo?.id) return actions;

    if (handleAddDevicesToGroup) {
      actions.push({
        title: 'Add to group',
        onClick: () =>
          handleAddDevicesToGroup(
            [
              {
                ID: rowData.rowInfo.deviceID,
                name: rowData.rowInfo.display_name,
              },
            ],
            true
          ),
      });
    }

    if (handleRemoveDevicesFromGroup) {
      actions.push({
        title: 'Remove from group',
        isDisabled: rowData?.rowInfo?.deviceGroups.length === 0,
        onClick: () =>
          handleRemoveDevicesFromGroup(
            [
              {
                ID: rowData.rowInfo.deviceID,
                name: rowData.rowInfo.display_name,
                deviceGroups: rowData.rowInfo.deviceGroups,
              },
            ],
            true
          ),
      });
    }

    if (!areActionsDisabled(rowData)) {
      actions.push({
        title: 'Update',
        onClick: (_event, _rowId, rowData) => {
          history.push({
            pathname: `${deviceBaseUrl}/${rowData.rowInfo.id}/update`,
          });
        },
      });
    }

    if (canBeRemoved) {
      actions.push({
        title: 'Remove from group',
        onClick: () =>
          setRemoveModal({
            name: rowData.rowInfo.display_name,
            isOpen: true,
            deviceId: rowData.rowInfo.deviceID,
          }),
      });
    }

    return actions;
  };

  const areActionsDisabled = (rowData) =>
    !rowData.rowInfo?.UpdateAvailable &&
    (rowData.rowInfo?.deviceStatus === 'updating' ||
      rowData.rowInfo?.deviceStatus === 'upToDate');

  return (
    <>
      {isSystemsView && emptyStateNoFilters(isLoading, count, search) ? (
        <CustomEmptyState
          data-testid="general-table-empty-state-no-data"
          icon={'plus'}
          title={'Connect edge systems'}
          body={
            'Connect and manage edge systems here after registering them via the console. To start, create a RHEL for Edge image and install it to your target system.'
          }
          secondaryActions={[
            {
              title:
                'Create RHEL for Edge images and configure automated management',
              link: 'https://access.redhat.com/documentation/en-us/edge_management/2022/html-single/create_rhel_for_edge_images_and_configure_automated_management/index',
              type: 'link',
            },
          ]}
        />
      ) : (
        <GeneralTable
          historyProp={historyProp}
          locationProp={locationProp}
          apiFilterSort={true}
          isUseApi={true}
          filters={defaultFilters}
          loadTableData={fetchDevices}
          tableData={{
            count: count,
            isLoading: isLoading,
            hasError: hasError,
          }}
          columnNames={columnNames}
          rows={createRows(
            data || [],
            isAddSystemsView || isSystemsView,
            fetchDevices,
            deviceBaseUrl
          )}
          actionResolver={actionResolver}
          defaultSort={{ index: 3, direction: 'desc' }}
          toolbarButtons={
            (canBeAdded
              ? [
                  {
                    title: 'Add systems',
                    click: () => setIsAddModalOpen(true),
                  },
                ]
              : [],
            canBeUpdated
              ? [
                  {
                    isDisabled: !selectedItemsUpdateable,
                    title: 'Update',
                    id: 'toolbar-update-button',
                    click: () => handleUpdateSelected(),
                  },
                ]
              : [])
          }
          hasCheckbox={hasCheckbox}
          selectedItems={selectedItems}
          skeletonRowQuantity={skeletonRowQuantity}
          kebabItems={kebabItems}
          hasModalSubmitted={hasModalSubmitted}
          setHasModalSubmitted={setHasModalSubmitted}
        />
      )}
    </>
  );
};

DeviceTable.propTypes = {
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  openUpdateWizard: PropTypes.func,
  skeletonRowQuantity: PropTypes.number,
  // possibly remove some of these
  temp: PropTypes.func,
  hasCheckbox: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  selectedItems: PropTypes.func,
  selectedItemsUpdateable: PropTypes.bool,
  reload: PropTypes.bool,
  setReload: PropTypes.func,
  data: PropTypes.array,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  handleSingleDeviceRemoval: PropTypes.func,
  kebabItems: PropTypes.array,
  setRemoveModal: PropTypes.func,
  setIsAddModalOpen: PropTypes.func,
  hasModalSubmitted: PropTypes.bool,
  setHasModalSubmitted: PropTypes.func,
  handleAddDevicesToGroup: PropTypes.func,
  handleRemoveDevicesFromGroup: PropTypes.func,
  handleUpdateSelected: PropTypes.func,
  fetchDevices: PropTypes.func,
  isSystemsView: PropTypes.bool,
  isAddSystemsView: PropTypes.bool,
};

export default DeviceTable;
