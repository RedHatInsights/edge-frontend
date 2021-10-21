import React from 'react';
import { Modal } from '@patternfly/react-core';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';

const RepoModal = ({
    isOpen,
    title,
    toggle,
    submitLabel,
    schema,
    initialValues,
    variant,
    onSubmit,
}) => {
    return (
        <Modal variant='small' title={title} isOpen={isOpen} onClose={toggle}>
            <FormRenderer
                schema={schema}
                FormTemplate={(props) => (
                    <FormTemplate
                        {...props}
                        submitLabel={submitLabel}
                        buttonsProps={{
                            submit: { variant },
                        }}
                    />
                )}
                initialValues={initialValues}
                componentMapper={componentMapper}
                onSubmit={(values) => {
                    onSubmit(values);
                    toggle();
                }}
                onCancel={() => toggle()}
            />
        </Modal>
    );
};

export default RepoModal;
