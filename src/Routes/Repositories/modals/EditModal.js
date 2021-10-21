import React from 'react';
import Modal from './Modal';
import { HelperText, HelperTextItem } from '@patternfly/react-core';

const EditModal = ({ toggle, isOpen, id, name, baseURL, setData }) => {
    console.log(id);
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
                helperText: (
                    <HelperText hasIcon>
                        <HelperTextItem
                            className='pf-u-pb-md'
                            variant='warning'
                            hasIcon
                        >
                            If you change the repo URL, you may not have access
                            to the packages that were used to build images that
                            reference this repository.
                        </HelperTextItem>
                    </HelperText>
                ),

                isRequired: true,
            },
        ],
    };

    return (
        <Modal
            title='Edit Repository'
            isOpen={isOpen}
            toggle={() => toggle({ type: 'edit' })}
            submitLabel='Update'
            schema={editSchema}
            initialValues={{ id, name, baseURL }}
            onSubmit={(values) =>
                setData((prevState) =>
                    prevState.map((repo) =>
                        repo.id === values.id ? { ...values } : repo
                    )
                )
            }
        />
    );
};

export default EditModal;
