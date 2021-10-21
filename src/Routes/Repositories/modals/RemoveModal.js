import React from 'react';
import Modal from './Modal';
import { TextContent, Text } from '@patternfly/react-core';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

const LabelWithText = ({ label, text }) => {
    return (
        <TextContent>
            <Text component={'b'}>{label}</Text>
            <Text>{text}</Text>
        </TextContent>
    );
};

const RemoveModal = ({ toggle, isOpen, id, name, baseURL, setData }) => {
    const addSchema = {
        fields: [
            {
                component: 'plain-text',
                name: 'description',
                label: 'Removing a repository could affect your ability to update images.',
            },
            {
                component: 'plain-text',
                name: 'name',
                label: <LabelWithText label='Name' text={name} />,
            },
            {
                component: 'plain-text',
                name: 'baseURL',
                label: <LabelWithText label='baseURL' text={baseURL} />,
            },
        ],
    };

    return (
        <Modal
            title={
                <>
                    <ExclamationTriangleIcon
                        color={warningColor.value}
                        className='pf-u-mr-md'
                    />
                    Remove Repository
                </>
            }
            isOpen={isOpen}
            toggle={() => toggle({ type: 'remove' })}
            submitLabel='Remove'
            schema={addSchema}
            variant='danger'
            onSubmit={() => {
                setData((prevState) =>
                    prevState.filter((repo) => repo.id !== id)
                );
            }}
        />
    );
};

export default RemoveModal;
