import React from 'react';
import { Modal } from '@patternfly/react-core';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import PropTypes from 'prop-types';

const RepoModal = ({
  isOpen,
  title,
  openModal, // should be closeModal, update here and other places that use it
  submitLabel,
  schema,
  initialValues,
  variant,
  reloadData,
  size,
  onSubmit,
  additionalMappers,
}) => {
  return (
    <Modal
      variant={size ?? 'small'}
      title={title}
      isOpen={isOpen}
      onClose={openModal}
    >
      <FormRenderer
        schema={schema}
        FormTemplate={(props) => (
          <FormTemplate
            {...props}
            submitLabel={submitLabel}
            disableSubmit={['invalid']}
            buttonsProps={{
              submit: { variant },
            }}
          />
        )}
        initialValues={initialValues}
        componentMapper={
          additionalMappers
            ? { ...additionalMappers, ...componentMapper }
            : componentMapper
        }
        onSubmit={async (values) => {
          await onSubmit(values);
          setTimeout(async () => await reloadData(), 500);
          openModal();
        }}
        onCancel={() => openModal()}
      />
    </Modal>
  );
};

RepoModal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  openModal: PropTypes.func,
  reloadData: PropTypes.func,
  submitLabel: PropTypes.string,
  schema: PropTypes.object,
  initialValues: PropTypes.object,
  variant: PropTypes.string,
  onSubmit: PropTypes.func,
  size: PropTypes.string,
  additionalMappers: PropTypes.object,
};

export default RepoModal;
