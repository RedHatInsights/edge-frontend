import React from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import SearchInput from '../../components/SearchInput';
import useApi from '../../hooks/useApi';
import apiWithToast from '../../utils/apiWithToast';
import { getGroups, addDevicesToGroup } from '../../api';
import { useDispatch } from 'react-redux';
import { Button, Text } from '@patternfly/react-core';

const CreateGroupButton = ({ openModal }) => (
  <>
    <Text>Or</Text>
    <Button variant="secondary" className="pf-u-w-50" onClick={openModal}>
      Create Group
    </Button>
  </>
);

CreateGroupButton.propTypes = {
  openModal: PropTypes.bool,
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
      name: 'name',
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
  const [response] = useApi(getGroups);

  const handleAddDevices = (values) => {
    const { group } = values;
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `Device(s) has been added to ${group.toString()} successfully`,
      },
      onError: { title: 'Error', description: 'Failed to add device to group' },
    };

    apiWithToast(
      dispatch,
      () => addDevicesToGroup(parseInt(group.groupId), deviceIds),
      statusMessages
    );
  };
  return (
    <Modal
      isOpen={isModalOpen}
      openModal={() => setIsModalOpen(false)}
      title="Add to group"
      submitLabel="Add"
      additionalMappers={{
        'search-input': {
          component: SearchInput,
          defaultOptions: response?.data?.data || [],
        },
        'create-group-btn': {
          component: CreateGroupButton,
          openModal: () => {
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
