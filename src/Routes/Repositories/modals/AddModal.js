import React from 'react';
import Modal from './Modal';
import { createCustomRepository } from '../../../api/index';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

const AddModal = ({ isOpen, toggle, reloadData }) => {
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
        validate: [{ type: validatorTypes.REQUIRED }],
      },
      {
        component: 'textarea',
        name: 'baseURL',
        label: 'BaseURL',
        placeholder: 'https://',
        helperText: 'Enter the baseURL for the custom repository.',
        isRequired: true,
        validate: [{ type: validatorTypes.REQUIRED }],
      },
    ],
  };

  return (
    <Modal
      title="Add Repository"
      isOpen={isOpen}
      toggle={() => toggle({ type: 'add' })}
      submitLabel="Add"
      schema={addSchema}
      onSubmit={(values) => createCustomRepository(values)}
      reloadData={reloadData}
    />
  );
};

AddModal.propTypes = {
  toggle: PropTypes.func,
  reloadData: PropTypes.func,
  isOpen: PropTypes.boo,
};

export default AddModal;
