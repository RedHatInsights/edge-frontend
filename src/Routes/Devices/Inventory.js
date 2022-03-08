import React, { Fragment, useState } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import DeviceTable from './DeviceTable';

const Inventory = () => {
  const [reload, setReload] = useState([]);
  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Inventory" />
      </PageHeader>
      <Main className="edge-devices">
        <DeviceTable
          reload={reload}
          setReload={setReload}
          hasCheckbox={false}
        />
      </Main>
    </Fragment>
  );
};

export default Inventory;
