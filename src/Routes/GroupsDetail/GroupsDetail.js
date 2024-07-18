import React, { useState, Suspense } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Skeleton,
  Tooltip,
} from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownPosition,
} from '@patternfly/react-core/deprecated';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import Empty from '../../components/Empty';
import { useHistory, useLocation } from 'react-router-dom';
import { routes as paths } from '../../constants/routeMapper';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import DeviceTable from '../Devices/DeviceTable';
import { useParams } from 'react-router-dom';
import {
  getGroupById,
  removeDeviceFromGroupById,
  removeDevicesFromGroup,
} from '../../api/groups';
import AddSystemsToGroupModal from '../Devices/AddSystemsToGroupModal';
import {
  canUpdateSelectedDevices,
  createLink,
  emptyStateNoFilters,
} from '../../utils';
import useApi from '../../hooks/useApi';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Bullseye, Spinner } from '@patternfly/react-core';
import Modal from '../../components/Modal';
import DeleteGroupModal from '../Groups/DeleteGroupModal';
import RenameGroupModal from '../Groups/RenameGroupModal';
import PropTypes from 'prop-types';
import { useFeatureFlags } from '../../utils';
import {
  FEATURE_PARITY_INVENTORY_GROUPS,
  FEATURE_INVENTORY_WORKSPACES_RENAME,
} from '../../constants/features';

const UpdateDeviceModal = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateDeviceModal" */ '../Devices/UpdateDeviceModal'
  )
);

const GroupsDetail = ({ locationProp, navigateProp, paramsProp }) => {
  const useInventoryGroups = useFeatureFlags(FEATURE_PARITY_INVENTORY_GROUPS);
  const useWorkspacesRename = useFeatureFlags(
    FEATURE_INVENTORY_WORKSPACES_RENAME
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const params = paramsProp ? paramsProp() : useParams();
  const groupId = params?.id ? params.id : params.groupId;
  const { search, pathname } = locationProp ? locationProp() : useLocation();
  const currentApplicationPath =
    window.location.pathname.indexOf('edge') > 0 ? 'edge' : paths.inventory;
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
  const [response, fetchDevices] = useApi({
    api: getGroupById,
    id: groupId,
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;
  const groupName = data?.DeviceGroup?.Name;
  const [deviceIds, getDeviceIds] = useState([]);
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);
  const [modalState, setModalState] = useState({ id: null, name: '' });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const handleDeleteModal = (id, name) => {
    setModalState({ id, name });
    setIsDeleteModalOpen(true);
  };

  const handleRenameModal = (id, name) => {
    setModalState({ id, name });
    setIsRenameModalOpen(true);
  };

  const removeDeviceLabel = () =>
    `Do you want to remove ${
      deviceIds.length > 0
        ? `${deviceIds.length} system${deviceIds.length === 1 ? '' : 's'}`
        : `${removeModal.name}`
    } from ${groupName}?`;

  const handleSingleDeviceRemoval = () => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${removeModal.name} has been removed successfully`,
      },
      onError: { title: 'Error', description: 'Failed to remove system' },
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
        description: `${deviceIds.length} systems have been removed successfully`,
      },
      onError: { title: 'Error', description: 'failed to remove systems' },
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

  const actionsLabel = 'Actions for group details view';
  const dropdownId = 'group-details-dropdown';

  return (
    <>
      <PageHeader className="pf-m-light">
        {groupName ? (
          <Breadcrumb>
            <BreadcrumbItem>
              {createLink({
                pathname:
                  currentApplicationPath === 'edge'
                    ? `edge${paths.fleetManagement}`
                    : `insights/inventory/groups`,
                linkText: 'Groups',
              })}
            </BreadcrumbItem>
            <BreadcrumbItem>{groupName}</BreadcrumbItem>
          </Breadcrumb>
        ) : (
          <Breadcrumb>
            <BreadcrumbItem isActive>
              <Skeleton width="100px" />
            </BreadcrumbItem>
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
                  id={dropdownId}
                  toggleIndicator={CaretDownIcon}
                  onToggle={(_event, newState) => setIsDropdownOpen(newState)}
                  isDisabled={false}
                  aria-label={actionsLabel}
                >
                  <Tooltip
                    content={actionsLabel}
                    triggerRef={() => document.getElementById(dropdownId)}
                  />
                  Actions
                </DropdownToggle>
              }
              isOpen={isDropdownOpen}
              dropdownItems={[
                <DropdownItem
                  key="delete-device-group"
                  onClick={() => handleDeleteModal(groupId, groupName)}
                >
                  Delete group
                </DropdownItem>,
                <DropdownItem
                  key="rename-device-group"
                  onClick={() => handleRenameModal(groupId, groupName)}
                >
                  Rename group
                </DropdownItem>,
                <DropdownItem
                  key="update-all-devices"
                  isDisabled={canUpdateSelectedDevices({
                    deviceData: data?.DevicesView?.devices?.map((device) => ({
                      imageSetId: device?.ImageSetID,
                    })),
                    imageData: data?.DevicesView?.devices?.some(
                      (device) => device.ImageID
                    ),
                  })}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setUpdateModal((prevState) => ({
                      ...prevState,
                      isOpen: true,
                      deviceData: data?.DevicesView?.devices?.map((device) => ({
                        id: device?.DeviceUUID,
                        display_name:
                          device?.DeviceName === ''
                            ? 'localhost'
                            : device?.DeviceName,
                      })),
                      imageSetId: data?.DevicesView?.devices.find(
                        (device) => device.ImageSetID
                      )?.ImageSetID,
                    }));
                  }}
                >
                  Update
                </DropdownItem>,
              ]}
            />
          </FlexItem>
        </Flex>
      </PageHeader>
      <section className="edge-devices pf-l-page__main-section pf-c-page__main-section">
        {!emptyStateNoFilters(
          isLoading,
          data?.DeviceGroup?.Devices.length,
          search
        ) ? (
          <DeviceTable
            data={data?.DevicesView?.devices || []}
            count={data?.DevicesView?.total}
            isLoading={isLoading}
            locationProp={locationProp}
            navigateProp={navigateProp}
            paramsProp={useParams}
            hasError={hasError}
            hasCheckbox={true}
            handleSingleDeviceRemoval={handleSingleDeviceRemoval}
            kebabItems={[
              {
                isDisabled: !(deviceIds.length > 0),
                title: `Remove from ${
                  useInventoryGroups && useWorkspacesRename
                    ? 'workspace'
                    : 'group'
                }`,
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
                    imageSetId: deviceIds.find((device) => device?.imageSetId)
                      .imageSetId,
                  })),
              },
            ]}
            selectedItems={getDeviceIds}
            setRemoveModal={setRemoveModal}
            setIsAddModalOpen={setIsAddModalOpen}
            hasModalSubmitted={hasModalSubmitted}
            setHasModalSubmitted={setHasModalSubmitted}
            fetchDevices={fetchDevices}
            isAddSystemsView={true}
            enforceEdgeGroups={data?.DevicesView?.enforce_edge_groups}
          />
        ) : (
          <Flex justifyContent={{ default: 'justifyContentCenter' }}>
            <Empty
              icon="plus"
              title="Add systems to the group"
              body="Create groups to help manage your systems more effectively."
              primaryAction={{
                text: 'Add systems',
                click: () => setIsAddModalOpen(true),
              }}
              secondaryActions={[
                {
                  type: 'link',
                  title: 'Learn more about system groups',
                  link: 'https://access.redhat.com/documentation/en-us/edge_management/2022/html-single/working_with_systems_in_the_edge_management_application/index',
                },
              ]}
            />
          </Flex>
        )}
      </section>
      {isAddModalOpen && (
        <AddSystemsToGroupModal
          groupId={groupId}
          closeModal={() => setIsAddModalOpen(false)}
          isOpen={isAddModalOpen}
          reloadData={fetchDevices}
          groupName={data?.DeviceGroup?.Name}
          locationProp={locationProp}
          navigateProp={navigateProp}
        />
      )}
      {removeModal.isOpen && (
        <Modal
          isOpen={removeModal.isOpen}
          closeModal={() => setRemoveModal(false)}
          title={`Remove from ${
            useInventoryGroups && useWorkspacesRename ? 'workspace' : 'group'
          }`}
          submitLabel={'Remove'}
          variant="danger"
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
          reloadData={fetchDevices}
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
              history.push({ pathname });
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
      {isDeleteModalOpen && (
        <DeleteGroupModal
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          reloadData={() => history.push(paths.fleetManagement)}
          modalState={modalState}
        />
      )}
      {isRenameModalOpen && (
        <RenameGroupModal
          isModalOpen={isRenameModalOpen}
          setIsModalOpen={setIsRenameModalOpen}
          reloadData={() => fetchDevices()}
          modalState={modalState}
        />
      )}
    </>
  );
};

GroupsDetail.propTypes = {
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
  paramsProp: PropTypes.func,
};

export default GroupsDetail;
