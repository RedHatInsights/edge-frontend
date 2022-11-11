import React, { useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import DeviceTable from './DeviceTable';
import AddDeviceModal from './AddDeviceModal';
import RemoveDeviceModal from './RemoveDeviceModal';
import CreateGroupModal from '../Groups/CreateGroupModal';
import UpdateSystem from './UpdateSystem';
import useApi from '../../hooks/useApi';
import { getInventory } from '../../api/devices';
import { Link, useHistory } from 'react-router-dom';
import {
  TextContent,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "UpdateDeviceModal" */ './UpdateDeviceModal')
);

const Inventory = () => {
  const history = useHistory();
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

  const [updatePage, setUpdatePage] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });

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

  return (
    <>
      <PageHeader className="pf-m-light">
        {updatePage.isOpen && (
          <Breadcrumb>
            <BreadcrumbItem
              onClick={() =>
                setUpdatePage((prev) => ({ ...prev, isOpen: false }))
              }
            >
              <Link to="/inventory">Systems</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Update</BreadcrumbItem>
          </Breadcrumb>
        )}
        <PageHeaderTitle title={updatePage.isOpen ? 'Update' : 'Systems'} />
        {updatePage.isOpen && (
          <TextContent className="pf-u-mt-md">
            <Text>
              Update <strong>{updatePage?.deviceData[0]?.display_name}</strong>{' '}
              to a newer version of{' '}
              <strong>{updatePage?.imageData?.imageName}</strong> by selecting a
              new version from the table below.
            </Text>
          </TextContent>
        )}
      </PageHeader>
      <Main className="edge-devices">
        {updatePage.isOpen ? (
          <UpdateSystem
            setUpdatePage={setUpdatePage}
            systemId={updatePage.deviceData[0].id}
            refreshTable={reloadData}
          />
        ) : (
          <DeviceTable
            isSystemsView={true}
            data={data?.data?.devices}
            count={data?.count}
            isLoading={isLoading}
            hasError={hasError}
            setUpdatePage={setUpdatePage}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
            handleAddDevicesToGroup={handleAddDevicesToGroup}
            handleRemoveDevicesFromGroup={handleRemoveDevicesFromGroup}
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
        )}
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
    </>
  );
};

export default Inventory;
