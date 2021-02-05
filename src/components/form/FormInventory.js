import React, { Fragment, useRef } from 'react';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import PropTypes from 'prop-types';
import { InventoryContext } from './constants';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { entitiesReducer } from '../../store/inventory-table';
import { selectEntity } from '../../store/actions';

const calculateChecked = (rows = [], selected) =>
  rows.every(({ id }) => selected?.has(id))
    ? rows.length > 0
    : rows.some(({ id }) => selected?.has(id)) && null;

const FormInventoryTable = ({
  name,
  FieldProvider,
  validate,
  FormSpyProvider,
  formOptions,
  component,
  registry,
  onLoad,
  ...rest
}) => {
  const dispatch = useDispatch();
  const inventory = useRef(null);
  const selected = useSelector(
    ({ entities }) => entities?.selected || new Map()
  );
  const loaded = useSelector(({ entities }) => entities?.loaded);
  const rows = useSelector(({ entities }) => entities?.rows);
  const onRefresh = (options, callback) => {
    if (!callback && inventory && inventory.current) {
      inventory.current.onRefreshData(options);
    } else if (callback) {
      callback(options);
    }
  };
  const calculateSelected = () => (selected ? selected.size : 0);

  return (
    <div>
      <InventoryTable
        {...rest}
        bulkSelect={{
          count: calculateSelected(),
          items: [
            {
              title: 'Select none (0)',
              onClick: () => {
                dispatch(selectEntity(-1, false));
              },
            },
            {
              ...(loaded && rows && rows.length > 0
                ? {
                    title: `Select page (${rows.length})`,
                    onClick: () => {
                      dispatch(selectEntity(0, true));
                    },
                  }
                : {}),
            },
          ],
          checked: calculateChecked(rows, selected),
          onSelect: (value) => {
            dispatch(selectEntity(0, value));
          },
        }}
        ref={inventory}
        onRefresh={onRefresh}
        tableProps={{
          canSelectAll: false,
        }}
        onLoad={({ mergeWithEntities, INVENTORY_ACTION_TYPES, ...rest }) => {
          registry?.register?.(
            mergeWithEntities(entitiesReducer(INVENTORY_ACTION_TYPES))
          );
          onLoad({ mergeWithEntities, INVENTORY_ACTION_TYPES, ...rest });
        }}
      />
    </div>
  );
};

const WrappedFormInventoryTable = (props) => (
  <InventoryContext.Consumer>
    {({ registry, onLoad }) =>
      registry ? (
        <Provider store={registry.store}>
          <FormInventoryTable registry={registry} onLoad={onLoad} {...props} />
        </Provider>
      ) : (
        <Fragment />
      )
    }
  </InventoryContext.Consumer>
);

WrappedFormInventoryTable.propTypes = {
  FieldProvider: PropTypes.any,
  formOptions: PropTypes.any,
  FormSpyProvider: PropTypes.any,
  validate: PropTypes.any,
  name: PropTypes.string,
  size: PropTypes.string,
  component: PropTypes.any,
};

FormInventoryTable.propTypes = {
  ...WrappedFormInventoryTable.propTypes,
  registry: PropTypes.shape({
    register: PropTypes.func,
  }),
  onLoad: PropTypes.func,
};

FormInventoryTable.defaultProps = {
  onLoad: () => undefined,
};

export default WrappedFormInventoryTable;
