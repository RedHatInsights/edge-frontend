import React from 'react';
import Modal from './Modal';
import { createCustomRepository } from '../../../api/index';

const AddModal = ({ isOpen, toggle }) => {
    const addSchema = {
        fields: [
            {
                component: 'plain-text',
                name: 'title',
                label: 'Link to a third-party repository to add packages to RHEL for Edge images.',
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
                helperText: 'Enter the baseURL for the third-party repository.',
                isRequired: true,
            },
        ],
    };

    return (
        <Modal
            title='Add Repository'
            isOpen={isOpen}
            toggle={() => toggle({ type: 'add' })}
            submitLabel='Add'
            schema={addSchema}
            onSubmit={(values) => createCustomRepository(values)}
        />
    );
};

export default AddModal;
