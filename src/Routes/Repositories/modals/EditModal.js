import React from 'react';
import Modal from '../../../components/Modal';
import { HelperText, HelperTextItem } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { editCustomRepository } from '../../../api/repositories';
import apiWithToast from '../../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const EditModal = ({ openModal, isOpen, id, name, baseURL, reloadData }) => {
  const dispatch = useDispatch();

  const handleAddRepository = (values) => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${values.name} has been edited successfully`,
      },
      onError: { title: 'Error', description: 'Failed to edit a repo' },
    };
    apiWithToast(dispatch, () => editCustomRepository(values), statusMessages);
  };

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
      onSubmit={handleAddRepository}
      reloadData={reloadData}
    />
  );
};

EditModal.propTypes = {
  openModal: PropTypes.func,
  reloadData: PropTypes.func,
  isOpen: PropTypes.bool,
  id: PropTypes.number,
  name: PropTypes.string,
  baseURL: PropTypes.string,
  setData: PropTypes.func,
};
export default EditModal;
