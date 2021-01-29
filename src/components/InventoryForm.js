import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormRenderer } from '@data-driven-forms/react-form-renderer';
import {
  FormTemplate as Pf4FormTemplate,
  componentMapper,
} from '@data-driven-forms/pf4-component-mapper';
import { FormInventoryTable, INVENTORY_TABLE } from './form';
import ReducerRegistry from '@redhat-cloud-services/frontend-components-utilities/files/esm/ReducerRegistry';
import { InventoryContext } from './form/constants';
import promiseMiddleware from 'redux-promise-middleware';
import { Modal, Button } from '@patternfly/react-core';
import { preSelectEntity } from '../store/actions';

const FormTemplate = (props) => (
  <Pf4FormTemplate {...props} showFormControls={false} />
);

const InventoryForm = ({
  isOpened,
  onAction,
  schema,
  title,
  selectedSystems,
}) => {
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

  const Wrapper = title ? Modal : Fragment;

  return (
    <InventoryContext.Provider
      value={{
        registry,
        onLoad: () => {
          selectedSystems?.map(({ id }) => {
            registry.store.dispatch(preSelectEntity(id, true));
          });
        },
      }}
    >
      <Wrapper
        {...(title && {
          title,
          variant: 'medium',
          isOpen: isOpened,
          onClose: () => onAction(false),
          actions: [
            <Button
              key="confirm"
              variant="primary"
              onClick={() => {
                const { entities } = registry.store.getState();
                onAction(true, {
                  selected: Array.from(entities?.selected?.keys() || []),
                });
              }}
            >
              Confirm
            </Button>,
            <Button key="cancel" variant="link" onClick={() => onAction(false)}>
              Cancel
            </Button>,
          ],
        })}
      >
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
      </Wrapper>
    </InventoryContext.Provider>
  );
};

InventoryForm.propTypes = {
  isOpened: PropTypes.bool,
  onAction: PropTypes.func,
  schema: PropTypes.object,
  title: PropTypes.string,
  selectedSystems: PropTypes.arrayOf({
    id: PropTypes.string,
  }),
};

InventoryForm.defaultProps = {
  onAction: () => {},
  schema: {},
};

export default InventoryForm;
