/* eslint-disable prettier/prettier */
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
import UpdateSystems from './UpdateSystems';
import useApi from '../../hooks/useApi';
import { getInventory } from '../../api/devices';
import {
  Bullseye,
  Spinner,
  TextContent,
  Text,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';

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
  const [isSystemUpdating, setIsSystemUpdating] = useState(true);
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

  // const handleUpdateSelected = () => {
  //   setUpdateModal((prevState) => ({
  //     ...prevState,
  //     deviceData: checkedDeviceIds.map((device) => ({
  //       id: device.id,
  //       display_name: device.display_name,
  //       deviceStatus: device.deviceStatus,
  //     })),
  //     imageSetId: checkedDeviceIds[0].imageSetId,
  //     isOpen: true,
  //   }));
  // };

  const handleUpdateSelected = () => {
    setIsSystemUpdating((prevState) => !prevState);
  };

  const reloadData = async () => {
    await fetchDevices();
    setHasModalSubmitted(true);
  };

  return (
    <Fragment>
      <PageHeader className='pf-m-light'>
        {isSystemUpdating && (
          <Breadcrumb>
            <BreadcrumbItem onClick={handleUpdateSelected}>
              Systems
            </BreadcrumbItem>
            <BreadcrumbItem>Update</BreadcrumbItem>
          </Breadcrumb>
        )}
        <PageHeaderTitle title={isSystemUpdating ? 'Update' : 'Systems'} />
        {isSystemUpdating && (
          <TextContent className='pf-u-mt-md'>
            <Text>
              Update <strong>Banna001</strong> to a newer version of{' '}
              <strong>PeelsYouPeel</strong> by selecting a new version from the
              table below.
            </Text>
          </TextContent>
        )}
      </PageHeader>
      <Main className='edge-devices'>
        {!isSystemUpdating ? (
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
        ) : (
          <UpdateSystems />
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
    </Fragment>
  );
};

export default Inventory;
