import React, { Fragment, useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useHistory } from 'react-router-dom';
import DeviceTable from './DeviceTable';
import AddDeviceModal from './AddDeviceModal';
import RemoveDeviceModal from './RemoveDeviceModal';
import CreateGroupModal from '../Groups/CreateGroupModal';
import useApi from '../../hooks/useApi';
import { getInventory } from '../../api/devices';
import { Bullseye, Spinner } from '@patternfly/react-core';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "CreateImageWizard" */ './UpdateDeviceModal')
);

const Inventory = () => {
  const [response, fetchDevices] = useApi({
    api: getInventory,
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [isRemoveDeviceModalOpen, setIsRemoveDeviceModalOpen] = useState(false);
  const [deviceId, setDeviceId] = useState([]);
  const [checkedDeviceIds, setCheckedDeviceIds] = useState([]);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });

  const history = useHistory();

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

  const setCanBeUpdated = () => {
    let canBeUpdated = false;
    if (checkedDeviceIds.length > 0) {
      let initialImage = checkedDeviceIds[0].imageSetId;
      for (let device of checkedDeviceIds) {
        if (device.imageSetId !== initialImage) {
          canBeUpdated = false;
          break;
        }
        if (!canBeUpdated && device.updateImageData) {
          canBeUpdated = true;
        }
      }
    }
    return canBeUpdated;
  };

  /*
  const setCanBeUpdated = () => {
    let canBeUpdated = false;
    if (checkedDeviceIds.length > 0) {
      canBeUpdated = 
        checkedDeviceIds.reduce(checkImageAndUpdateStatus, {
          previousId: null,
          buttonEnabled: false,
        })
      ).buttonEnabled;
      //console.log(canBeUpdated);
    }
    return canBeUpdated;
  };

  const checkImageAndUpdateStatus = (previousDevice, currentDevice) => {
    console.log(currentDevice.updateImageData);
    console.log(previousDevice);
    if (
      previousDevice.previousId &&
      previousDevice.previousId !== currentDevice.ImageSetId
    ) {
      previousDevice.buttonEnabled = false;
      return previousDevice;
    }

    previousDevice.previousId = currentDevice.imageSetId;
    if (previousDevice.buttonEnabled === false) {
      previousDevice.buttonEnabled = currentDevice.updateImageData;
    }

    console.log(previousDevice?.buttonEnabled);
    console.log(previousDevice);
    return previousDevice;
  };
  */
  const handleUpdateSelected = () => {
    setUpdateModal((prevState) => ({
      ...prevState,
      deviceData: checkedDeviceIds.map((device) => ({
        id: device.id,
        display_name: device.display_name,
      })),
      imageSetId: checkedDeviceIds[0].imageSetId,
      isOpen: true,
    }));
  };

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Systems" />
      </PageHeader>
      <Main className="edge-devices">
        <DeviceTable
          isSystemsView={true}
          data={data?.data?.devices}
          count={data?.count}
          isLoading={isLoading}
          hasError={hasError}
          setUpdateModal={setUpdateModal}
          handleAddDevicesToGroup={handleAddDevicesToGroup}
          handleRemoveDevicesFromGroup={handleRemoveDevicesFromGroup}
          handleUpdateSelected={handleUpdateSelected}
          hasCheckbox={true}
          selectedItems={setCheckedDeviceIds}
          selectedItemsUpdateable={setCanBeUpdated()}
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
      </Main>
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
              history.push({ pathname: history.location.pathname });
              setUpdateModal((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
            refreshTable={fetchDevices}
          />
        </Suspense>
      )}
      {isAddDeviceModalOpen && (
        <AddDeviceModal
          isModalOpen={isAddDeviceModalOpen}
          setIsModalOpen={setIsAddDeviceModalOpen}
          setIsCreateGroupModalOpen={setIsCreateGroupModalOpen}
          reloadData={() => {
            fetchDevices();
            setTimeout(() => setHasModalSubmitted(true), 800);
          }}
          deviceIds={isRowSelected ? deviceId : checkedDeviceIds}
        />
      )}
      {isCreateGroupModalOpen && (
        <CreateGroupModal
          isModalOpen={isCreateGroupModalOpen}
          setIsModalOpen={setIsCreateGroupModalOpen}
          reloadData={() => {
            fetchDevices();
            setTimeout(() => setHasModalSubmitted(true), 800);
          }}
          deviceIds={isRowSelected ? deviceId : checkedDeviceIds}
        />
      )}
      {isRemoveDeviceModalOpen && (
        <RemoveDeviceModal
          isModalOpen={isRemoveDeviceModalOpen}
          setIsModalOpen={setIsRemoveDeviceModalOpen}
          reloadData={() => {
            fetchDevices();
            setTimeout(() => setHasModalSubmitted(true), 800);
          }}
          deviceInfo={isRowSelected ? deviceId : checkedDeviceIds}
        />
      )}
    </Fragment>
  );
};

export default Inventory;
