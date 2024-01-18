import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';
import { useHistory, useLocation, useNavigate } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { cellWidth } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';
import CustomEmptyState from '../../components/Empty';
import { createLink, emptyStateNoFilters, useFeatureFlags } from '../../utils';
import DeviceStatus, { getDeviceStatus } from '../../components/Status';
import RetryUpdatePopover from './RetryUpdatePopover';
import {
  FEATURE_HIDE_GROUP_ACTIONS,
  FEATURE_PARITY_INVENTORY_GROUPS,
} from '../../constants/features';

const insightsInventoryManageEdgeUrlName = 'manage-edge-inventory';

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

const GetColumnNames = (inventoryGroupsEnabled, isDataAvailable) => {
  return [
    {
      title: 'Name',
      type: 'name',
      sort: isDataAvailable,
      columnTransforms: [cellWidth(25)],
    },
    {
      title: 'Image',
      type: 'image',
      sort: false,
      columnTransforms: [cellWidth(20)],
    },
    {
      title: inventoryGroupsEnabled ? 'Group' : 'Groups',
      type: 'groups',
      sort: false,
      columnTransforms: [cellWidth(15)],
    },
    {
      title: 'Last seen',
      type: 'last_seen',
      sort: isDataAvailable,
      columnTransforms: [cellWidth(15)],
    },
    {
      title: 'Status',
      type: 'status',
      sort: false,
      columnTransforms: [cellWidth(25)],
    },
  ];
};

const createRows = (
  devices,
  hasLinks,
  fetchDevices,
  deviceBaseUrl,
  history,
  navigate,
  inventoryGroupsEnabled
) => {
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
      GroupName,
      GroupUUID,
    } = device;
    const deviceStatus = getDeviceStatus(
      Status,
      UpdateAvailable,
      DispatcherStatus
    );

    // const currentInventoryPath = history ? '/edge' : paths.inventory;

    if (DeviceName === '') {
      // needs to be fixed with proper name in sync with inv
      DeviceName = 'localhost';
    }

    if (inventoryGroupsEnabled) {
      if (GroupName && GroupUUID) {
        DeviceGroups = [{ ID: GroupUUID, Name: GroupName }];
      } else {
        DeviceGroups = [];
      }
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
    const pathToDevice =
      deviceBaseUrl !== 'federated'
        ? `edge${paths.inventory}/${DeviceUUID}`
        : `insights/inventory/${DeviceUUID}`;
    const pathToImage =
      deviceBaseUrl !== 'federated'
        ? `edge${paths.manageImages}/${ImageSetID}`
        : `insights/image-builder/manage-edge-images/${ImageSetID}`;

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
          title: hasLinks
            ? createLink({
                pathname: pathToDevice,
                linkText: DeviceName,
                navigate,
              })
            : DeviceName,
        },
        {
          title: ImageName
            ? hasLinks
              ? createLink({
                  pathname: pathToImage,
                  linkText: ImageName,
                  navigate,
                })
              : ImageName
            : 'unavailable',
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
  navigateProp,
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
  handleEditNameSystem,
  handleDeleteSystem,
  handleUpdateSelected,
  hasModalSubmitted,
  setHasModalSubmitted,
  fetchDevices,
  isSystemsView = false,
  isAddSystemsView = false,
  urlName,
  enforceEdgeGroups,
}) => {
  const canBeRemoved = setRemoveModal;
  const canBeAdded = setIsAddModalOpen;
  const canBeUpdated = isSystemsView;
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
  const { pathname, search } = locationProp
    ? locationProp()
    : useLocation
    ? useLocation()
    : null;

  const useInventorGroups = useFeatureFlags(FEATURE_PARITY_INVENTORY_GROUPS);
  const inventoryGroupsEnabled = !enforceEdgeGroups && useInventorGroups;

  // Create base URL path for system detail link
  const deviceBaseUrl = navigateProp
    ? 'federated'
    : pathname === paths.inventory
    ? pathname
    : pathname === '/'
    ? ''
    : `${pathname}/systems`;

  const hideGroupsActions = useFeatureFlags(FEATURE_HIDE_GROUP_ACTIONS);

  const actionResolver = (rowData) => {
    const getUpdatePathname = (updateRowData) =>
      navigateProp
        ? `/insights/inventory/${updateRowData.rowInfo.id}/update`
        : `/inventory/${updateRowData.rowInfo.id}/update`;
    const actions = [];
    if (isLoading) return actions;
    if (!rowData?.rowInfo?.id) return actions;

    if (handleAddDevicesToGroup && !hideGroupsActions) {
      actions.push({
        title: 'Add to group',
        isDisabled: inventoryGroupsEnabled
          ? rowData?.rowInfo?.deviceGroups.length !== 0 // disable the action item if the system has a group assigned
          : false,
        onClick: () =>
          handleAddDevicesToGroup(
            [
              {
                ID: rowData.rowInfo.deviceID,
                name: rowData.rowInfo.display_name,
                UUID: rowData.rowInfo.id,
              },
            ],
            true
          ),
      });
    }

    if (handleEditNameSystem) {
      actions.push({
        title: 'Edit',
        onClick: () =>
          handleEditNameSystem(
            [
              {
                ID: rowData.rowInfo.deviceID,
                name: rowData.rowInfo.display_name,
                UUID: rowData.rowInfo.id,
              },
            ],
            true
          ),
      });
    }

    if (handleDeleteSystem) {
      actions.push({
        title: 'Delete',
        onClick: () =>
          handleDeleteSystem(
            [
              {
                ID: rowData.rowInfo.deviceID,
                display_name: rowData.rowInfo.display_name,
                UUID: rowData.rowInfo.id,
              },
            ],
            true
          ),
      });
    }

    if (handleRemoveDevicesFromGroup && !hideGroupsActions) {
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
                UUID: rowData.rowInfo.id,
              },
            ],
            true
          ),
      });
    }

    if (!areActionsDisabled(rowData) && handleUpdateSelected) {
      actions.push({
        title: 'Update',
        onClick: (_event, _rowId, rowData) => {
          if (navigateProp) {
            const pathProp = getUpdatePathname(rowData);
            navigate(pathProp, { replace: true });
          } else {
            history.push({
              pathname: getUpdatePathname(rowData),
              // pathname: `${deviceBaseUrl}/${rowData.rowInfo.id}/update`,
            });
          }
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

  // some filters and columns titles/labels have different values when shown in insights inventory
  let tableFilters = [];
  let tableColumnNames = [];
  const isDataAvailable = data ? data.length > 0 : false;
  const columnNames = GetColumnNames(inventoryGroupsEnabled, isDataAvailable);

  if (urlName === insightsInventoryManageEdgeUrlName) {
    for (let ind = 0; ind < defaultFilters.length; ind++) {
      let filterElement = defaultFilters[ind];
      if (filterElement['label'] === 'Status') {
        filterElement['label'] = 'Image status';
      }
      tableFilters.push(filterElement);
    }
    for (let ind = 0; ind < columnNames.length; ind++) {
      let columnElement = columnNames[ind];
      if (columnElement['title'] === 'Status') {
        columnElement['title'] = 'Image status';
      }
      tableColumnNames.push(columnElement);
    }
  } else {
    tableFilters = defaultFilters;
    tableColumnNames = columnNames;
  }

  return (
    <div className="edge">
      <>
        {isSystemsView &&
        emptyStateNoFilters(isLoading, count, search) &&
        !historyProp ? (
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
            navigateProp={navigateProp}
            locationProp={locationProp}
            apiFilterSort={true}
            isUseApi={true}
            filters={tableFilters}
            loadTableData={fetchDevices}
            tableData={{
              count: count,
              isLoading: isLoading,
              hasError: hasError,
            }}
            columnNames={tableColumnNames}
            rows={createRows(
              data || [],
              isAddSystemsView || isSystemsView,
              fetchDevices,
              deviceBaseUrl,
              history,
              navigate,
              inventoryGroupsEnabled
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
    </div>
  );
};

DeviceTable.propTypes = {
  navigateProp: PropTypes.func,
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
  handleEditNameSystem: PropTypes.func,
  handleDeleteSystem: PropTypes.func,
  handleUpdateSelected: PropTypes.func,
  fetchDevices: PropTypes.func,
  isSystemsView: PropTypes.bool,
  isAddSystemsView: PropTypes.bool,
  urlName: PropTypes.string,
  groupUUID: PropTypes.string,
  enforceEdgeGroups: PropTypes.bool,
};

export default DeviceTable;
