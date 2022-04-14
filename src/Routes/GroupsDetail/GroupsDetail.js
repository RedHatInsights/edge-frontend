import React, { useEffect, useState, Suspense } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownPosition,
  Flex,
  FlexItem,
  Skeleton,
} from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import Empty from '../../components/Empty';
import { Link, useHistory } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import DeviceTable from '../Devices/DeviceTable';
import { useParams } from 'react-router-dom';
import {
  getGroupById,
  removeDeviceFromGroupById,
  removeDevicesFromGroup,
} from '../../api/index';
import DeviceModal from '../Devices/DeviceModal';
import { canUpdateSelectedDevices, stateToUrlSearch } from '../../constants';
import useApi from '../../hooks/useApi';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Bullseye, Spinner } from '@patternfly/react-core';
import Modal from '../../components/Modal';
import DeleteGroupModal from '../Groups/DeleteGroupModal';

const UpdateDeviceModal = React.lazy(() =>
  import('../Devices/UpdateDeviceModal')
);

const GroupsDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [removeModal, setRemoveModal] = useState({
    isOpen: false,
    name: '',
    deviceId: null,
  });
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });
  const [response, fetchData] = useApi(() => getGroupById(groupId));
  const { data, isLoading, hasError } = response;
  const { groupId } = params;
  const groupName = data?.DeviceGroup?.Name;
  const [deviceIds, getDeviceIds] = useState([]);
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);
  const [modalState, setModalState] = useState({ id: null, name: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteModal = (id, name) => {
    setModalState({ id, name });
    setIsDeleteModalOpen(true);
  };

  const removeDeviceLabel = () =>
    `Do you want to remove ${
      deviceIds.length > 0
        ? `${deviceIds.length} system${deviceIds.length === 1 ? '' : 's'}`
        : `${removeModal.name}`
    } from ${groupName}?`;

  useEffect(() => {
    history.push({
      pathname: history.location.pathname,
      search: stateToUrlSearch('add_system_modal=true', isAddModalOpen),
    });
  }, [isAddModalOpen]);

  const handleSingleDeviceRemoval = () => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${removeModal.name} has been removed successfully`,
      },
      onError: { title: 'Error', description: 'Failed to remove device' },
    };
    apiWithToast(
      dispatch,
      () => removeDeviceFromGroupById(groupId, removeModal.deviceId),
      statusMessages
    );
    setTimeout(() => setHasModalSubmitted(true), 800);
  };

  const handleBulkDeviceRemoval = () => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${deviceIds.length} devices have been removed successfully`,
      },
      onError: { title: 'Error', description: 'failed to remove devices' },
    };
    apiWithToast(
      dispatch,
      () =>
        removeDevicesFromGroup(
          parseInt(groupId),
          deviceIds.map((device) => ({ ID: device.deviceID }))
        ),
      statusMessages
    );
    setTimeout(() => setHasModalSubmitted(true), 800);
  };

  const getDeviceStatus = (deviceData) =>
    deviceData?.ImageInfo?.UpdatesAvailable
      ? 'updateAvailable'
      : deviceData?.Device?.Booted
      ? 'running'
      : 'booting';

  return (
    <>
      <PageHeader className="pf-m-light">
        {groupName ? (
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to={`${paths['fleet-management']}`}>Groups</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>{groupName}</BreadcrumbItem>
          </Breadcrumb>
        ) : (
          <Breadcrumb isActive>
            <Skeleton width="100px" />
          </Breadcrumb>
        )}
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            {groupName ? (
              <PageHeaderTitle title={groupName} />
            ) : (
              <Skeleton width="150px" />
            )}
          </FlexItem>
          <FlexItem>
            <Dropdown
              position={DropdownPosition.right}
              toggle={
                <DropdownToggle
                  id="image-set-details-dropdown"
                  toggleIndicator={CaretDownIcon}
                  onToggle={(newState) => setIsDropdownOpen(newState)}
                  isDisabled={false}
                >
                  Actions
                </DropdownToggle>
              }
              isOpen={isDropdownOpen}
              dropdownItems={[
                <DropdownItem
                  key="delete-device-group"
                  onClick={() => handleDeleteModal(groupId, groupName)}
                >
                  Delete Group
                </DropdownItem>,
                <DropdownItem
                  key="update-all-devices"
                  isDisabled={canUpdateSelectedDevices({
                    deviceData: data?.Devices?.data?.map((device) => ({
                      imageSetId: device?.ImageInfo?.Image.ImageSetID,
                    })),
                    imageData:
                      data?.Devices?.data[0].ImageInfo?.UpdatesAvailable?.[0],
                  })}
                  onClick={() =>
                    setUpdateModal((prevState) => ({
                      ...prevState,
                      isOpen: true,
                      deviceData: data?.Devices?.data?.map((device) => ({
                        deviceID: device?.Device?.ID,
                        id: device?.Device?.UUID,
                        display_name: device?.Device?.DeviceName,
                        updateImageData:
                          device?.ImageInfo?.UpdatesAvailable?.[0],
                        deviceStatus: getDeviceStatus(device),
                        imageSetId: device?.ImageInfo?.Image?.ImageSetID,
                        imageName: device?.ImageInfo?.Image?.Name,
                      })),
                      imageData:
                        data?.Devices?.data[0].ImageInfo.UpdatesAvailable?.[0],
                    }))
                  }
                >
                  Update
                </DropdownItem>,
              ]}
            />
          </FlexItem>
        </Flex>
      </PageHeader>
      <Main className="edge-devices">
        {isLoading || data?.Devices?.count > 0 ? (
          <DeviceTable
            data={data?.Devices?.data || []}
            count={data?.Devices?.count}
            isLoading={isLoading}
            hasError={hasError}
            hasCheckbox={true}
            handleSingleDeviceRemoval={handleSingleDeviceRemoval}
            kebabItems={[
              {
                isDisabled: !(deviceIds.length > 0),
                title: 'Remove from group',
                onClick: () =>
                  setRemoveModal({
                    name: '',
                    deviceId: null,
                    isOpen: true,
                  }),
              },
              {
                isDisabled: canUpdateSelectedDevices({
                  deviceData: deviceIds,
                  imageData: deviceIds[0]?.updateImageData,
                }),
                title: 'Update selected',
                onClick: () =>
                  setUpdateModal((prevState) => ({
                    ...prevState,
                    isOpen: true,
                    deviceData: [...deviceIds],
                    imageData: deviceIds[0].updateImageData,
                  })),
              },
            ]}
            selectedItems={getDeviceIds}
            setRemoveModal={setRemoveModal}
            setIsAddModalOpen={setIsAddModalOpen}
            setUpdateModal={setUpdateModal}
            hasModalSubmitted={hasModalSubmitted}
            setHasModalSubmitted={setHasModalSubmitted}
          />
        ) : (
          <Flex justifyContent={{ default: 'justifyContentCenter' }}>
            <Empty
              icon="cube"
              title="Add systems to the group"
              body="Create system groups to help manage your devices more effectively"
              primaryAction={{
                text: 'Add systems',
                click: () => setIsAddModalOpen(true),
              }}
              secondaryActions={[
                {
                  type: 'link',
                  title: 'Learn more about system groups',
                  link: '#',
                },
              ]}
            />
          </Flex>
        )}
      </Main>
      {isAddModalOpen && (
        <DeviceModal
          groupId={groupId}
          closeModal={() => setIsAddModalOpen(false)}
          isOpen={isAddModalOpen}
          reloadData={fetchData}
        />
      )}
      {removeModal.isOpen && (
        <Modal
          isOpen={removeModal.isOpen}
          openModal={() => setRemoveModal(false)}
          title={'Remove from group'}
          submitLabel={'Remove'}
          schema={{
            fields: [
              {
                component: componentTypes.PLAIN_TEXT,
                name: 'warning-text',
                label: removeDeviceLabel(),
              },
            ],
          }}
          onSubmit={
            removeModal.deviceId
              ? handleSingleDeviceRemoval
              : handleBulkDeviceRemoval
          }
          reloadData={fetchData}
        />
      )}

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
            refreshTable={fetchData}
          />
        </Suspense>
      )}
      {isDeleteModalOpen && (
        <DeleteGroupModal
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          reloadData={() => history.push(paths['fleet-management'])}
          modalState={modalState}
        />
      )}
    </>
  );
};

export default GroupsDetail;
