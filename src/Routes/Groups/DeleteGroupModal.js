import React from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import { deleteGroupById } from '../../api';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

const deleteGroupSchema = {
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'warning-message',
      label:
        'This action will delete the group and its data. Associated systems will be removed from the group, but will not be deleted.',
    },
    {
      component: componentTypes.CHECKBOX,
      name: 'confirmation',
      label: 'I understand that this action cannot be undone.',
      validate: [{ type: validatorTypes.REQUIRED }],
    },
  ],
};

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
  console.log(id, name);
  return (
    <Modal
      isOpen={isModalOpen}
      openModal={() => setIsModalOpen(false)}
      title={`Delete ${name}`}
      titleIconVariant={WarningIcon}
      variant="danger"
      submitLabel="Delete"
      schema={deleteGroupSchema}
      onSubmit={(values) => deleteGroupById(id, values)}
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
