import React from 'react';
import Modal from './Modal';

const EditModal = ({ toggle, isOpen, name, baseURL }) => {
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
      },
      {
        component: 'textarea',
        name: 'baseURL',
        label: 'BaseURL',
        placeholder: 'https://',
        helperText:
          'If you change the repo URL, you may not have access to the packages that were used to build images that reference this repository.',
        isRequired: true,
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
      initialValues={{ name, baseURL }}
    />
  );
};

export default EditModal;
