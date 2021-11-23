import { Redirect, Route, Switch } from 'react-router-dom';

import React, { Suspense } from 'react';
import { routes as paths } from '../package.json';
import { Bullseye, Spinner } from '@patternfly/react-core';
// const Groups = React.lazy(() =>
//   import(/* webpackChunkName: "GroupsPage" */ './Routes/Groups/Groups')
// );
// const GroupsDetail = React.lazy(() =>
//   import(
//     /* webpackChunkName: "GroupsDetailPage" */ './Routes/GroupsDetail/GroupsDetail'
//   )
// );

const DeviceDetail = React.lazy(() =>
  import(
    /* webpackChunkName: "GroupsDetailPage" */ './Routes/DeviceDetail/DeviceDetail'
  )
);

// const Canaries = React.lazy(() =>
//   import(
//     /* webpackChunkName: "GroupsDetailPage" */ './Routes/Canaries/Canaries'
//   )
// );

const Devices = React.lazy(() =>
  import(/* webpackChunkName: "GroupsDetailPage" */ './Routes/Devices/Devices')
);

const Images = React.lazy(() =>
  import(
    /* webpackChunkName: "GroupsDetailPage" */ './Routes/ImageManager/Images'
  )
);

const ImageDetail = React.lazy(() =>
  import('./Routes/ImageManagerDetail/ImageDetail')
);

const Repositories = React.lazy(() =>
  import('./Routes/Repositories/Repositories')
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
        {/* <Route exact path={paths.groups} component={Groups} /> */}
        {/* <Route exact path={paths['groups-detail']} component={GroupsDetail} /> */}
        {/* <Route path={paths['device-detail']} component={DeviceDetail} /> */}
        {/* <Route path={paths.canaries} component={Canaries} /> */}
        <Route exact path={paths['fleet-management']} component={Devices} />
        <Route
          path={paths['manage-images-version-details']}
          component={ImageDetail}
        />
        <Route path={paths['manage-images-detail']} component={ImageDetail} />
        <Route path={paths['manage-images']} component={Images} />
        <Route
          path={paths['fleet-management-detail']}
          component={DeviceDetail}
        />
        <Route exact path={paths['repositories']} component={Repositories} />
        <Route>
          <Redirect to={paths['fleet-management']} />
        </Route>
      </Switch>
    </Suspense>
  );
};
