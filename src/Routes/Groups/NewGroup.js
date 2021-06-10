import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import schema from './newGroupSchema';
import { FormInventoryTable, INVENTORY_TABLE } from '../../components/form';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { InventoryContext } from '../../components/form/constants';
import promiseMiddleware from 'redux-promise-middleware';

const FormTemplate = (props) => (
  <Pf4FormTemplate {...props} showFormControls={false} />
);

const NewGroup = ({ onAction }) => {
  const [registry, setRegistry] = useState();
  useEffect(() => {
    setRegistry(
      new ReducerRegistry(
        {
          selected: new Map(),
        },
        [promiseMiddleware]
      )
    );
  }, []);

  return (
    <InventoryContext.Provider value={{ registry }}>
      <FormRenderer
        schema={schema}
        FormTemplate={FormTemplate}
        componentMapper={{
          ...componentMapper,
          [INVENTORY_TABLE]: FormInventoryTable,
        }}
        onSubmit={(values) => {
          const { entities } = registry.store.getState();
          onAction(true, {
            ...values,
            selected: Array.from(entities?.selected?.keys() || []),
          });
        }}
        onCancel={(...args) => onAction(false, ...args)}
      />
    </InventoryContext.Provider>
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
