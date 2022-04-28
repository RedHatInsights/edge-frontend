import React from 'react';
import Modal from '../../../components/Modal';
import { HelperText, HelperTextItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { editCustomRepository } from '../../../api/index';

const EditModal = ({ openModal, isOpen, id, name, baseURL, reloadData }) => {
  const editSchema = {
    fields: [
      {
        component: 'plain-text',
        name: 'title',
        label: 'Update information about this custom repository.',
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
        helperText: (
          <HelperText hasIcon>
            <HelperTextItem className="pf-u-pb-md" variant="warning" hasIcon>
              If you change the repo URL, you may not have access to the
              packages that were used to build images that reference this
              repository.
            </HelperTextItem>
          </HelperText>
        ),

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
      title="Edit repository"
      isOpen={isOpen}
      openModal={() => openModal({ type: 'edit' })}
      submitLabel="Update"
      schema={editSchema}
      initialValues={{ id, name, baseURL }}
      onSubmit={(values) => editCustomRepository(values)}
      reloadData={reloadData}
    />
  );
};

EditModal.propTypes = {
  openModal: PropTypes.func,
  reloadData: PropTypes.func,
  isOpen: PropTypes.boo,
  id: PropTypes.number,
  name: PropTypes.string,
  baseURL: PropTypes.string,
  setData: PropTypes.func,
};
export default EditModal;
