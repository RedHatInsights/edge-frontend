import React from 'react';
import Modal from './Modal';
import { HelperText, HelperTextItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

const EditModal = ({ toggle, isOpen, id, name, baseURL, reloadData }) => {
  const editSchema = {
    fields: [
      {
        component: 'plain-text',
        name: 'title',
        label: 'Update information about this third-party repository.',
      },
      {
        component: 'text-field',
        name: 'name',
        label: 'Name',
        placeholder: 'Repository name',
        helperText:
          'Can only contain letters, numbers, spaces, hypthon ( - ), and underscores( _ ).',
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
        validate: [{ type: validatorTypes.REQUIRED }],
      },
    ],
  };

  return (
    <Modal
      title="Edit Repository"
      isOpen={isOpen}
      toggle={() => toggle({ type: 'edit' })}
      submitLabel="Update"
      schema={editSchema}
      initialValues={{ id, name, baseURL }}
      onSubmit={console.log}
      reloadData={reloadData}
    />
  );
};

EditModal.propTypes = {
  toggle: PropTypes.func,
  reloadData: PropTypes.func,
  isOpen: PropTypes.boo,
  id: PropTypes.number,
  name: PropTypes.string,
  baseURL: PropTypes.string,
  setData: PropTypes.func,
};
export default EditModal;
