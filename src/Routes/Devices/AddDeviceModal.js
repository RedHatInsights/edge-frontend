import React, { useState } from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import SearchInputApi from '../../components/SearchInputApi';
import apiWithToast from '../../utils/apiWithToast';
import {
  addDevicesToGroup,
  addDevicesToInventoryGroup,
} from '../../api/groups';
import { useDispatch } from 'react-redux';
import { Button, Text } from '@patternfly/react-core';
import useInventoryGroups from '../../hooks/useInventoryGroups';
import { useFeatureFlags } from '../../utils';
import { FEATURE_INVENTORY_WORKSPACES_RENAME } from '../../constants/features';
import CreateGroupModal from '../Groups/CreateGroupModal';

const CreateGroupButton = ({ closeModal, workspaceRename }) => (
  <>
    <Text>Or</Text>
    <Button variant="secondary" className="pf-u-w-50" onClick={closeModal}>
      Create {workspaceRename ? 'Workspace' : 'Group'}
    </Button>
  </>
);

CreateGroupButton.propTypes = {
  closeModal: PropTypes.func,
  workspaceRename: PropTypes.bool,
};

const createDescription = (deviceIds, workspaceRename) => {
  const systemText =
    deviceIds.length > 1 ? `${deviceIds.length} systems` : deviceIds[0].name;
  return (
    <Text>
      Select a {workspaceRename ? 'workspace' : 'group'} to add{' '}
      <strong>{systemText} </strong> or create a new one.
    </Text>
  );
};

const createSchema = (deviceIds, workspaceRename) => ({
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: createDescription(deviceIds, workspaceRename),
    },
    {
      component: 'search-input',
      name: 'group',
      label: `Select a ${workspaceRename ? 'workspace' : 'group'}`,
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    { component: 'create-group-btn', name: 'create-group-btn' },
  ],
});

const AddDeviceModal = ({
  isModalOpen,
  setIsModalOpen,
  reloadData,
  deviceIds,
}) => {
  const dispatch = useDispatch();

  const [inventoryGroupsEnabled] = useInventoryGroups(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const useWorkspacesRename = useFeatureFlags(
    FEATURE_INVENTORY_WORKSPACES_RENAME
  );

  const handleAddDevices = (values) => {
    const { group } = values;
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `System(s) have been added to ${group.toString()} successfully`,
      },
      onError: {
        title: 'Error',
        description: `Failed to add system to ${
          inventoryGroupsEnabled && useWorkspacesRename ? 'workspace' : 'group'
        }`,
      },
    };

    let addDevicesToGroupFunc;
    if (inventoryGroupsEnabled) {
      addDevicesToGroupFunc = () =>
        addDevicesToInventoryGroup(group.groupId, deviceIds);
    } else {
      addDevicesToGroupFunc = () =>
        addDevicesToGroup(parseInt(group.groupId), deviceIds);
    }
    apiWithToast(dispatch, addDevicesToGroupFunc, statusMessages);
  };
  return (
    <>
      <Modal
        isOpen={isModalOpen && !isCreateGroupModalOpen}
        closeModal={() => setIsModalOpen(false)}
        title={`Add to ${
          inventoryGroupsEnabled && useWorkspacesRename ? 'workspace' : 'group'
        }`}
        submitLabel="Add"
        additionalMappers={{
          'search-input': {
            component: SearchInputApi,
          },
          'create-group-btn': {
            component: CreateGroupButton,
            closeModal: () => {
              setIsCreateGroupModalOpen(true);
            },
            workspaceRename: inventoryGroupsEnabled && useWorkspacesRename,
          },
        }}
        schema={createSchema(
          deviceIds,
          inventoryGroupsEnabled && useWorkspacesRename
        )}
        onSubmit={handleAddDevices}
        reloadData={reloadData}
      />
      {isCreateGroupModalOpen && (
        <CreateGroupModal
          isModalOpen={isCreateGroupModalOpen}
          setIsModalOpen={setIsCreateGroupModalOpen}
          reloadData={reloadData}
          deviceIds={deviceIds}
          // hasHostModal makes sure the host modal is opened
          // after this modal is closed
          hasHostModal
          setIsHostModalOpen={setIsModalOpen}
        />
      )}
    </>
  );
};

export default AddDeviceModal;

AddDeviceModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  reloadData: PropTypes.func,
  deviceIds: PropTypes.array,
};
