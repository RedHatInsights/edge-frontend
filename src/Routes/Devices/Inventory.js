import React, { useEffect, useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import DeviceTable from './DeviceTable';
import AddDeviceModal from './AddDeviceModal';
import RemoveDeviceModal from './RemoveDeviceModal';
import CreateGroupModal from '../Groups/CreateGroupModal';
import useApi from '../../hooks/useApi';
import { getInventory } from '../../api/devices';
import { useHistory, useLocation } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { editDisplayName, deleteEntity } from '../../store/actions';
import { useDispatch } from 'react-redux';
import apiWithToast from '../../utils/apiWithToast';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useFeatureFlags } from '../../utils';
import {
  FEATURE_HIDE_GROUP_ACTIONS,
  FEATURE_PARITY_INVENTORY_GROUPS,
} from '../../constants/features';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "UpdateDeviceModal" */ './UpdateDeviceModal')
);

const TextInputModal = (props) => (
  <AsyncComponent appName="inventory" module="./TextInputModal" {...props} />
);

const DeleteModal = (props) => (
  <AsyncComponent appName="inventory" module="./DeleteModal" {...props} />
);

const Inventory = ({
  historyProp,
  navigateProp,
  locationProp,
  showHeaderProp,
  notificationProp,
  urlName,
}) => {
  const chrome = useChrome();
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const { pathname } = locationProp
    ? locationProp()
    : useLocation
    ? useLocation()
    : null;
  const [response, fetchDevices] = useApi({
    api: getInventory,
    tableReload: true,
  });
  const showHeader = showHeaderProp === undefined ? true : showHeaderProp;
  const { data, isLoading, hasError } = response;
  const enforceEdgeGroups = data?.data?.enforce_edge_groups;
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isRemoveDeviceModalOpen, setIsRemoveDeviceModalOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deviceId, setDeviceId] = useState([]);
  const [checkedDeviceIds, setCheckedDeviceIds] = useState([]);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const dispatch = useDispatch();

  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });

  const useInventorGroups = useFeatureFlags(FEATURE_PARITY_INVENTORY_GROUPS);
  const inventoryGroupsEnabled = !enforceEdgeGroups && useInventorGroups;

  const handleAddDevicesToGroup = (ids, isRow) => {
    setIsAddDeviceModalOpen(true);
    isRow ? setDeviceId(ids) : setCheckedDeviceIds(ids);
    setIsRowSelected(isRow);
  };

  const handleRemoveDevicesFromGroup = (ids, isRow) => {
    setIsRemoveDeviceModalOpen(true);
    isRow ? setDeviceId(ids) : setCheckedDeviceIds(ids);
    setIsRowSelected(isRow);
  };

  const handleEditNameSystem = (ids, isRow) => {
    setIsEditNameModalOpen(true);
    isRow ? setDeviceId(ids) : setCheckedDeviceIds(ids);
    setIsRowSelected(isRow);
  };

  const handleDeleteSystem = (ids, isRow) => {
    setIsDeleteModalOpen(true);
    isRow ? setDeviceId(ids) : setCheckedDeviceIds(ids);
    setIsRowSelected(isRow);
  };

  const canBeUpdated = () => {
    let canBeUpdated = false;
    if (checkedDeviceIds.length > 0) {
      let initialImage = checkedDeviceIds[0].imageSetId;
      for (let device of checkedDeviceIds) {
        if (device.imageSetId !== initialImage) {
          canBeUpdated = false;
          break;
        }
        if (
          (!canBeUpdated &&
            device.updateImageData &&
            device.deviceStatus === 'updateAvailable') ||
          device.deviceStatus === 'unresponsive' ||
          device.deviceStatus === 'error'
        ) {
          canBeUpdated = true;
        }
      }
    }
    return canBeUpdated;
  };

  const handleUpdateSelected = () => {
    setUpdateModal((prevState) => ({
      ...prevState,
      deviceData: checkedDeviceIds.map((device) => ({
        id: device.id,
        display_name: device.display_name,
        deviceStatus: device.deviceStatus,
      })),
      imageData: { imageName: checkedDeviceIds[0].imageName },
      imageSetId: checkedDeviceIds[0].imageSetId,
      isOpen: true,
    }));
  };

  const reloadData = async () => {
    await fetchDevices();
    setHasModalSubmitted(true);
  };
  let classNameMain = '';
  if (showHeaderProp !== undefined && showHeader) {
    classNameMain =
      'edge-devices pf-l-page__main-section pf-c-page__main-section';
  } else if (!showHeader) {
    classNameMain = 'pf-c-toolbar';
  }

  function handleOnSubmitEditName(value) {
    const uuid = isRowSelected ? deviceId[0].UUID : checkedDeviceIds[0].UUID;
    const name = isRowSelected ? deviceId[0].name : checkedDeviceIds[0].name;
    const statusMessages = {
      onSuccess: {
        title: `Display name for entity with ID ${uuid} has been changed to ${value}`,
      },
      onError: { title: 'Error', description: 'Failed to update device name' },
    };
    if (notificationProp) {
      apiWithToast(
        dispatch,
        () => editDisplayName(uuid, value, name),
        statusMessages,
        notificationProp
      );
    } else {
      dispatch(editDisplayName(uuid, value, name));
    }
    setIsEditNameModalOpen(false);
  }

  function handleOnConfirmDeleteSystem() {
    const systemInstance = isRowSelected ? deviceId[0] : checkedDeviceIds[0];

    let displayName = systemInstance.display_name;
    let removeSystems = [systemInstance.UUID];
    const statusInitialMessages = {
      onWarning: {
        title: 'Delete operation initiated',
        description: `Removal of ${displayName} started.`,
      },
      onError: {
        title: 'Error',
        description: 'Failed to initial delete device',
      },
    };
    const statusMessages = {
      onSuccess: {
        title: 'Delete operation finished',
        description: `${displayName} has been successfully removed.`,
      },
      onError: { title: 'Error', description: 'Failed to delete device' },
    };

    if (notificationProp) {
      apiWithToast(
        dispatch,
        () =>
          addNotification({
            id: 'remove-initiated',
            variant: 'warning',
          }),
        statusInitialMessages,
        notificationProp
      );
      apiWithToast(
        dispatch,
        () => deleteEntity(removeSystems, displayName),
        statusMessages,
        notificationProp
      );
    } else {
      dispatch(
        addNotification({
          id: 'remove-initiated',
          variant: 'warning',
          title: 'Delete operation initiated',
          description: `Removal of ${displayName} started.`,
          dismissable: false,
        })
      );
      dispatch(deleteEntity(removeSystems, displayName));
    }
    setIsDeleteModalOpen(false);
  }

  useEffect(() => {
    chrome?.updateDocumentTitle?.('Systems - Inventory | Edge management');
  }, [chrome]);

  const hideGroupsActions = useFeatureFlags(FEATURE_HIDE_GROUP_ACTIONS);
  const kebabMenuItems = [];
  if (!hideGroupsActions) {
    const groupsKebabMenuItems = [
      {
        isDisabled: inventoryGroupsEnabled
          ? !(checkedDeviceIds.length > 0) ||
            checkedDeviceIds.filter((device) => device.deviceGroups?.length > 0)
              .length > 0 // The action menu item is disabled if one of the systems items belongs to a group
          : !(checkedDeviceIds.length > 0),
        title: 'Add to group',
        onClick: () =>
          handleAddDevicesToGroup(
            checkedDeviceIds.map((device) => ({
              ID: device.deviceID,
              name: device.display_name,
              UUID: device.id,
            })),
            false
          ),
      },
    ];

    if (inventoryGroupsEnabled) {
      groupsKebabMenuItems.push({
        isDisabled:
          !(checkedDeviceIds.length > 0) || // disable if no system checked
          checkedDeviceIds.filter(
            // disable if any checked systems has no groups assigned
            (device) =>
              device.deviceGroups === undefined ||
              device.deviceGroups.length === 0
          ).length > 0 ||
          checkedDeviceIds.reduce((acc, device) => {
            // disable if the checked systems has different groups assigned
            const groupIDS = device.deviceGroups
              ? device.deviceGroups.map((group) => group.ID)
              : [];
            const newGroupIDS = groupIDS.filter(
              (groupID) => !acc.includes(groupID)
            );
            acc.push(...newGroupIDS);
            return acc;
          }, []).length !== 1,
        title: 'Remove from group',
        onClick: () =>
          handleRemoveDevicesFromGroup(
            checkedDeviceIds.map((device) => ({
              ID: device.deviceID,
              name: device.display_name,
              UUID: device.id,
              deviceGroups: device.deviceGroups,
            })),
            false
          ),
      });
    }
    kebabMenuItems.push(...groupsKebabMenuItems);
  }

  return (
    <>
      {showHeader && (
        <PageHeader className="pf-m-light">
          <PageHeaderTitle title="Systems" />
        </PageHeader>
      )}
      {showHeader}
      <section className={classNameMain}>
        <DeviceTable
          historyProp={historyProp}
          navigateProp={navigateProp}
          locationProp={locationProp}
          isSystemsView={true}
          data={data?.data?.devices}
          count={data?.count}
          isLoading={isLoading}
          hasError={hasError}
          setUpdateModal={setUpdateModal}
          updateModal={updateModal}
          handleAddDevicesToGroup={handleAddDevicesToGroup}
          handleRemoveDevicesFromGroup={handleRemoveDevicesFromGroup}
          handleEditNameSystem={handleEditNameSystem}
          handleDeleteSystem={handleDeleteSystem}
          handleUpdateSelected={handleUpdateSelected}
          hasCheckbox={true}
          selectedItems={setCheckedDeviceIds}
          selectedItemsUpdateable={canBeUpdated()}
          kebabItems={kebabMenuItems.length > 0 ? kebabMenuItems : undefined}
          hasModalSubmitted={hasModalSubmitted}
          setHasModalSubmitted={setHasModalSubmitted}
          fetchDevices={fetchDevices}
          urlName={urlName}
          enforceEdgeGroups={enforceEdgeGroups}
        />
      </section>
      {updateModal.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateDeviceModal
            navigateBack={() => {
              history.push({ pathname });
              setUpdateModal((prevState) => {
                console.log('Click modal');
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
            notificationProp={notificationProp}
            refreshTable={reloadData}
          />
        </Suspense>
      )}
      {isAddDeviceModalOpen && (
        <AddDeviceModal
          isModalOpen={isAddDeviceModalOpen}
          setIsModalOpen={setIsAddDeviceModalOpen}
          setIsCreateGroupModalOpen={setIsCreateGroupModalOpen}
          reloadData={reloadData}
          deviceIds={isRowSelected ? deviceId : checkedDeviceIds}
        />
      )}
      {isCreateGroupModalOpen && (
        <CreateGroupModal
          isModalOpen={isCreateGroupModalOpen}
          setIsModalOpen={setIsCreateGroupModalOpen}
          reloadData={reloadData}
          deviceIds={isRowSelected ? deviceId : checkedDeviceIds}
        />
      )}
      {isRemoveDeviceModalOpen && (
        <RemoveDeviceModal
          isModalOpen={isRemoveDeviceModalOpen}
          setIsModalOpen={setIsRemoveDeviceModalOpen}
          reloadData={reloadData}
          deviceInfo={isRowSelected ? deviceId : checkedDeviceIds}
        />
      )}
      {isEditNameModalOpen && (
        <TextInputModal
          isOpen={isEditNameModalOpen}
          title="Edit display name"
          value={isRowSelected ? deviceId[0].name : checkedDeviceIds[0].name}
          ariaLabel="Host inventory display name"
          modalOuiaId="edit-display-name-modal"
          cancelOuiaId="cancel-edit-display-name"
          confirmOuiaId="confirm-edit-display-name"
          inputOuiaId="input-edit-display-name"
          onCancel={() => setIsEditNameModalOpen(false)}
          onSubmit={handleOnSubmitEditName}
          className="sentry-mask data-hj-suppress"
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          className="sentry-mask data-hj-suppress"
          handleModalToggle={setIsDeleteModalOpen}
          isModalOpen={isDeleteModalOpen}
          currentSytems={isRowSelected ? deviceId[0] : checkedDeviceIds[0]}
          onConfirm={handleOnConfirmDeleteSystem}
        />
      )}
    </>
  );
};

Inventory.propTypes = {
  historyProp: PropTypes.func,
  navigateProp: PropTypes.func,
  locationProp: PropTypes.func,
  showHeaderProp: PropTypes.bool,
  notificationProp: PropTypes.object,
  urlName: PropTypes.string,
};

export default Inventory;
