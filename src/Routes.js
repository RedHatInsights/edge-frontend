import { Redirect, Route, Switch } from 'react-router-dom';

import React, { Suspense } from 'react';
import { routes as paths } from '../package.json';
import { Bullseye, Spinner } from '@patternfly/react-core';
const Groups = React.lazy(() =>
  import(/* webpackChunkName: "GroupsPage" */ './Routes/Groups/Groups')
);
const GroupsDetail = React.lazy(() =>
  import(
    /* webpackChunkName: "GroupsDetailPage" */ './Routes/GroupsDetail/GroupsDetail'
  )
);

const DeviceDetail = React.lazy(() =>
  import(
    /* webpackChunkName: "GroupsDetailPage" */ './Routes/DeviceDetail/DeviceDetail'
  )
);

const Canaries = React.lazy(() =>
  import(
    /* webpackChunkName: "GroupsDetailPage" */ './Routes/Canaries/Canaries'
  )
);

const Devices = React.lazy(() =>
  import(/* webpackChunkName: "GroupsDetailPage" */ './Routes/Devices/Devices')
);

export const Routes = () => {
  return (
    <Suspense
      fallback={
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      }
    >
      <Switch>
        <Route exact path={paths.groups} component={Groups} />
        <Route exact path={paths['groups-detail']} component={GroupsDetail} />
        <Route path={paths['device-detail']} component={DeviceDetail} />
        <Route path={paths.canaries} component={Canaries} />
        <Route exact path={paths.devices} component={Devices} />
        <Route path={paths['devices-detail']} component={DeviceDetail} />
        <Route>
          <Redirect to={paths.groups} />
        </Route>
      </Switch>
    </Suspense>
  );
};
