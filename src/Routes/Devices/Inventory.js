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
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "UpdateDeviceModal" */ './UpdateDeviceModal')
);

const TextInputModal = (props) => (
  <AsyncComponent appName="inventory" module="./TextInputModal" {...props} />
);

const DeleteModal = (props) => (
  <AsyncComponent appName="inventory" module="./DeleteModal" {...props} />
);

const Inventory = ({ historyProp, locationProp, showHeaderProp }) => {
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
  }

  function handleOnSubmitEditName(value) {
    const uuid = isRowSelected ? deviceId[0].UUID : checkedDeviceIds[0].UUID;
    const name = isRowSelected ? deviceId[0].name : checkedDeviceIds[0].name;
    dispatch(editDisplayName(uuid, value, name));
    setIsEditNameModalOpen(false);
  }

  function handleOnConfirmDeleteSystem() {
    const systemInstance = isRowSelected ? deviceId[0] : checkedDeviceIds[0];

    let displayName = systemInstance.display_name;
    let removeSystems = [systemInstance.UUID];

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
    setIsDeleteModalOpen(false);
  }

  useEffect(() => {
    chrome?.updateDocumentTitle?.('Systems - Inventory | Edge management');
  }, [chrome]);

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
          kebabItems={[
            {
              isDisabled: !(checkedDeviceIds.length > 0),
              title: 'Add to group',
              onClick: () =>
                handleAddDevicesToGroup(
                  checkedDeviceIds.map((device) => ({
                    ID: device.deviceID,
                    name: device.display_name,
                  })),
                  false
                ),
            },
          ]}
          hasModalSubmitted={hasModalSubmitted}
          setHasModalSubmitted={setHasModalSubmitted}
          fetchDevices={fetchDevices}
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
  locationProp: PropTypes.func,
  showHeaderProp: PropTypes.bool,
};

export default Inventory;
