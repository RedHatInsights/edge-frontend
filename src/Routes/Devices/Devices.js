import React, { Fragment, useRef, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { useHistory } from 'react-router-dom';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { cleanEntities } from '../../store/actions';
import { RegistryContext } from '../../store';

const Devices = () => {
  const { getRegistry } = useContext(RegistryContext);
  const inventory = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const onRefresh = (options, callback) => {
    if (!callback && inventory && inventory.current) {
      inventory.current.onRefreshData(options);
    } else if (callback) {
      callback(options);
    }
  };

  useEffect(() => {
    return () => dispatch(cleanEntities());
  }, []);
  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Available devices" />
      </PageHeader>
      <Main className="edge-devices">
        <InventoryTable
          ref={inventory}
          onRefresh={onRefresh}
          tableProps={{
            canSelectAll: false,
          }}
          onRowClick={(_e, id) => history.push(`/devices/${id}`)}
          onLoad={({ mergeWithEntities }) => {
            getRegistry()?.register?.({
              ...mergeWithEntities(),
            });
          }}
        />
      </Main>
    </Fragment>
  );
};

export default Devices;
