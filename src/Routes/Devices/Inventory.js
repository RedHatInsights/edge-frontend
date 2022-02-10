import React, { Fragment } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import DeviceTable from './DeviceTable';

const Inventory = () => {
  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Inventory" />
      </PageHeader>
      <Main className="edge-devices">
        <DeviceTable />
      </Main>
    </Fragment>
  );
};

export default Inventory;
