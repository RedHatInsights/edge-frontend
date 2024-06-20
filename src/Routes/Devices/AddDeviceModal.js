import React from 'react';
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

const CreateGroupButton = ({ closeModal }) => (
  <>
    <Text>Or</Text>
    <Button variant="secondary" className="pf-u-w-50" onClick={closeModal}>
      Create Group
    </Button>
  </>
);

CreateGroupButton.propTypes = {
  closeModal: PropTypes.func,
};

const createDescription = (deviceIds) => {
  const systemText =
    deviceIds.length > 1 ? `${deviceIds.length} systems` : deviceIds[0].name;
  return (
    <Text>
      Select a group to add <strong>{systemText} </strong> or create a new one.
    </Text>
  );
};

const createSchema = (deviceIds) => ({
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: createDescription(deviceIds),
    },
    {
      component: 'search-input',
      name: 'group',
      label: 'Select a group',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    },
    { component: 'create-group-btn', name: 'create-group-btn' },
  ],
});

const AddDeviceModal = ({
  isModalOpen,
  setIsModalOpen,
  setIsCreateGroupModalOpen,
  reloadData,
  deviceIds,
}) => {
  const dispatch = useDispatch();

  const [inventoryGroupsEnabled] = useInventoryGroups(false);
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
      onError: { title: 'Error', description: 'Failed to add system to group' },
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
    <Modal
      isOpen={isModalOpen}
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
            setIsModalOpen(false);
          },
        },
      }}
      schema={createSchema(deviceIds)}
      onSubmit={handleAddDevices}
      reloadData={reloadData}
    />
  );
};

export default AddDeviceModal;

AddDeviceModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  setIsCreateGroupModalOpen: PropTypes.func,
  reloadData: PropTypes.func,
  deviceIds: PropTypes.array,
};
