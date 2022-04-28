import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import { createGroup, addDevicesToGroup, validateGroupName } from '../../api';
import { nameValidator } from '../../constants';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const asyncGroupNameValidation = async (value) => {
  const resp = await validateGroupName(value);
  // isValid should be isNotValid
  // who wrote that Go code :thinking_face:
  // spoiler: it was me
  if (resp.data.isValid) {
    return 'Group name already exists';
  }
};

const createGroupSchema = {
  fields: [
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      label: 'Group name',
      helperText:
        'Name must start with alphanumeric characters and can contain underscore and hyphen characters.',
      isRequired: true,
      validate: [
        { type: validatorTypes.REQUIRED },

        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
        nameValidator,
        asyncGroupNameValidation,
      ],
    },
  ],
};

const CreateGroupModal = ({
  isModalOpen,
  setIsModalOpen,
  deviceIds,
  reloadData,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    /*
      temp focus solution, better approach to pass a ref input and set it
      when form inputs are mounted
    */

    setTimeout(() => {
      const input = document.querySelector('#name');
      if (input) input.focus();
    }, 50);
  }, []);

  const handleCreateGroup = (values) => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${values.name} has been created successfully`,
      },
      onError: { title: 'Error', description: 'Failed to create group' },
    };
    return apiWithToast(dispatch, () => createGroup(values), statusMessages);
  };

  const handleAddDevicesToNewGroup = async (values) => {
    const { ID } = await handleCreateGroup(values);

    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `Device(s) have been added to ${values.name} successfully`,
      },
      onError: { title: 'Error', description: 'Failed to add device to group' },
    };

    apiWithToast(
      dispatch,
      () => addDevicesToGroup(parseInt(ID), deviceIds),
      statusMessages
    );
  };

  return (
    <Modal
      isOpen={isModalOpen}
      openModal={() => setIsModalOpen(false)}
      title="Create group"
      submitLabel="Create"
      schema={createGroupSchema}
      onSubmit={deviceIds ? handleAddDevicesToNewGroup : handleCreateGroup}
      reloadData={reloadData}
    />
  );
};

export default CreateGroupModal;

CreateGroupModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  reloadData: PropTypes.func,
  deviceIds: PropTypes.array,
};
