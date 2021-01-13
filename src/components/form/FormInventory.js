import React, { Fragment, useRef } from 'react';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/components/esm/Inventory';
import PropTypes from 'prop-types';
import { InventoryContext } from './constants';
import { Provider } from 'react-redux';
import { entitiesReducer } from '../../store/inventory-table';

const FormInventoryTable = ({
  name,
  FieldProvider,
  validate,
  FormSpyProvider,
  formOptions,
  component,
  ...rest
}) => {
  const inventory = useRef(null);
  const onRefresh = (options, callback) => {
    if (!callback && inventory && inventory.current) {
      inventory.current.onRefreshData(options);
    } else if (callback) {
      callback(options);
    }
  };

  return (
    <InventoryContext.Consumer>
      {({ registry }) => {
        return registry ? (
          <Provider store={registry.getStore()}>
            <InventoryTable
              {...rest}
              ref={inventory}
              onRefresh={onRefresh}
              tableProps={{
                canSelectAll: false,
              }}
              onLoad={({ mergeWithEntities }) => {
                registry?.register?.(mergeWithEntities(entitiesReducer()));
              }}
            />
          </Provider>
        ) : (
          <Fragment />
        );
      }}
    </InventoryContext.Consumer>
  );
};

FormInventoryTable.propTypes = {
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.any,
  FormSpyProvider: PropTypes.any,
  validate: PropTypes.any,
  name: PropTypes.string,
  size: PropTypes.string,
  component: PropTypes.any,
};

export default FormInventoryTable;
