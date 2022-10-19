import React from 'react';
import Modal from '../../../components/Modal';
import {
  createCustomRepository,
  validateRepoName,
} from '../../../api/repositories';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { nameValidator } from '../../../utils';
import apiWithToast from '../../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const asyncRepoNameValidation = async (value) => {
  const resp = await validateRepoName(value);
  if (resp.data.isValid) {
    return 'Repository name already exists';
  }
};

const AddModal = ({ isOpen, closeModal, reloadData }) => {
  const dispatch = useDispatch();

  const handleAddRepository = (values) => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${values.name} has been created successfully`,
      },
      onError: { title: 'Error', description: 'Failed to create a repo' },
    };
    apiWithToast(
      dispatch,
      () => createCustomRepository(values),
      statusMessages
    );
  };

  const addSchema = {
    fields: [
      {
        component: 'plain-text',
        name: 'title',
        label:
          'Link to a custom repository to add packages to RHEL for Edge images.',
      },
      {
        component: 'text-field',
        name: 'name',
        label: 'Name',
        placeholder: 'Repository name',
        helperText:
          'Can only contain letters, numbers, spaces, hyphens ( - ), and underscores( _ ).',
        isRequired: true,
        validate: [
          { type: validatorTypes.REQUIRED },
          nameValidator,
          asyncRepoNameValidation,
        ],
      },
      {
        component: 'textarea',
        name: 'baseURL',
        label: 'BaseURL',
        placeholder: 'https://',
        helperText: 'Enter the baseURL for the custom repository.',
        isRequired: true,
        validate: [
          { type: validatorTypes.REQUIRED },
          { type: validatorTypes.URL, message: 'Must be a valid url' },
        ],
      },
    ],
  };

  return (
    <Modal
      title="Add repository"
      isOpen={isOpen}
      closeModal={() => closeModal({ type: 'add' })}
      submitLabel="Add"
      schema={addSchema}
      onSubmit={handleAddRepository}
      reloadData={reloadData}
    />
  );
};

AddModal.propTypes = {
  closeModal: PropTypes.func,
  reloadData: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default AddModal;
