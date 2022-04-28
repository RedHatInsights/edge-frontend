import React from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import { updateGroupById, validateGroupName } from '../../api';
import { nameValidator } from '../../constants';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const asyncGroupNameValidation = async (value) => {
  const resp = await validateGroupName(value);
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
        'Can only contain letters, numbers, spaces, hyphens ( - ), and underscores( _ ).',
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

const RenameGroupModal = ({
  isModalOpen,
  setIsModalOpen,
  reloadData,
  modalState,
}) => {
  const { id, name } = modalState;
  const dispatch = useDispatch();

  const handleRenameModal = (values) => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${name} has been renamed to ${values.name} successfully`,
      },
      onError: { title: 'Error', description: 'Failed to rename group' },
    };
    apiWithToast(dispatch, () => updateGroupById(id, values), statusMessages);
  };
  return (
    <Modal
      isOpen={isModalOpen}
      openModal={() => setIsModalOpen(false)}
      title="Rename group"
      submitLabel="Save"
      schema={createGroupSchema}
      initialValues={modalState}
      onSubmit={handleRenameModal}
      reloadData={reloadData}
    />
  );
};

RenameGroupModal.propTypes = {
  id: PropTypes.number,
  modalState: PropTypes.object,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  reloadData: PropTypes.func,
};
export default RenameGroupModal;
