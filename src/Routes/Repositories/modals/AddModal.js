import React from 'react';
import Modal from '../../../components/Modal';
import { createCustomRepository } from '../../../api/index';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { nameValidator } from '../../../constants';

const AddModal = ({ isOpen, openModal, reloadData }) => {
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
        validate: [{ type: validatorTypes.REQUIRED }, nameValidator],
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
      title='Add Repository'
      isOpen={isOpen}
      openModal={() => openModal({ type: 'add' })}
      submitLabel='Add'
      schema={addSchema}
      onSubmit={(values) => createCustomRepository(values)}
      reloadData={reloadData}
    />
  );
};

AddModal.propTypes = {
  openModal: PropTypes.func,
  reloadData: PropTypes.func,
  isOpen: PropTypes.boo,
};

export default AddModal;
