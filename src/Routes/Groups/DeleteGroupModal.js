import React from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import { deleteGroupById } from '../../api/groups';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
import { Text } from '@patternfly/react-core';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const description = (name) => (
  <Text>
    <strong>{name} </strong>and all its data will be permanently deleted.
    Associated systems will be removed from the group but will not be deleted.
  </Text>
);

const schema = (name) => ({
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'warning-message',
      label: description(name),
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'confirmation',
      label: 'I understand that this action cannot be undone.',
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
});

const WarningIcon = () => (
  <ExclamationTriangleIcon color={warningColor.value} />
);

const DeleteGroupModal = ({
  isModalOpen,
  setIsModalOpen,
  reloadData,
  modalState,
}) => {
  const { id, name } = modalState;
  const dispatch = useDispatch();

  const handleDeleteGroup = () => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${name} has been removed successfully`,
      },
      onError: { title: 'Error', description: 'Failed to delete group' },
    };
    apiWithToast(dispatch, () => deleteGroupById(id), statusMessages);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      openModal={() => setIsModalOpen(false)}
      title='Delete group'
      titleIconVariant={WarningIcon}
      variant='danger'
      submitLabel='Delete'
      schema={schema(name)}
      onSubmit={handleDeleteGroup}
      reloadData={reloadData}
    />
  );
};

DeleteGroupModal.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  modalState: PropTypes.object,
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  reloadData: PropTypes.func,
};
export default DeleteGroupModal;
