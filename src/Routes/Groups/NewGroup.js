import React from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/esm/component-mapper';
import schema from './newGroupSchema';
import { Modal } from '@patternfly/react-core';

const FormTemplate = (props) => (
  <Pf4FormTemplate {...props} showFormControls={false} />
);

const NewGroup = ({ isOpened, onAction }) => {
  return (
    <Modal
      title="Create new group"
      variant="medium"
      isOpen={isOpened}
      onClose={() => onAction(false)}
    >
      <FormRenderer
        schema={schema}
        FormTemplate={FormTemplate}
        componentMapper={componentMapper}
        onSubmit={(...args) => onAction(true, ...args)}
        onCancel={(...args) => onAction(false, ...args)}
      />
    </Modal>
  );
};

NewGroup.propTypes = {
  isOpened: PropTypes.bool,
  onAction: PropTypes.func,
};

NewGroup.defaultProps = {
  onAction: () => {},
};

export default NewGroup;
