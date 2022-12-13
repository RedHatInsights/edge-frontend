import { Redirect, Route, Switch } from 'react-router-dom';

import React, { Suspense } from 'react';
import { routes as paths } from './constants/routeMapper';
import { Bullseye, Spinner } from '@patternfly/react-core';

const DeviceDetail = React.lazy(() =>
  import(
    /* webpackChunkName: "DeviceDetail" */ './Routes/DeviceDetail/DeviceDetail'
  )
);

// const Canaries = React.lazy(() =>
//   import(
//     /* webpackChunkName: "Canaries" */ './Routes/Canaries/Canaries'
//   )
// );

const Groups = React.lazy(() =>
  import(/* webpackChunkName: "Groups" */ './Routes/Groups/Groups')
);

const GroupsDetail = React.lazy(() =>
  import(
    /* webpackChunkName: "GroupsDetail" */ './Routes/GroupsDetail/GroupsDetail'
  )
);

const Inventory = React.lazy(() =>
  import(/* webpackChunkName: "Inventory" */ './Routes/Devices/Inventory')
);

const UpdateSystem = React.lazy(() =>
  import(/* webpackChunkName: "UpdateSystem" */ './Routes/Devices/UpdateSystem')
);

const Images = React.lazy(() =>
  import(/* webpackChunkName: "Images" */ './Routes/ImageManager/Images')
);

const ImageDetail = React.lazy(() =>
  import(
    /* webpackChunkName: "ImageDetail" */ './Routes/ImageManagerDetail/ImageDetail'
  )
);

const Repositories = React.lazy(() =>
  import(
    /* webpackChunkName: "Repositories" */ './Routes/Repositories/Repositories'
  )
);

const LearningResources = React.lazy(() =>
  import(
    /* webpackChunkName: "LearningResources" */ './Routes/LearningResources/LearningResources'
  )
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

        {/* <Route path={paths['device-detail']} component={DeviceDetail} /> */}
        {/* <Route path={paths.canaries} component={Canaries} /> */}
        <Route exact path={paths['fleet-management']} component={Groups} />
        <Route
          exact
          path={paths['fleet-management-detail']}
          component={GroupsDetail}
        />
        <Route
          exact
          path={paths['fleet-management-system-detail']}
          component={DeviceDetail}
        />
        <Route
          exact
          path={paths['fleet-management-system-detail-update']}
          component={UpdateSystem}
        />
        <Route exact path={paths['inventory']} component={Inventory} />
        <Route
          exact
          path={paths['inventory-detail-update']}
          component={UpdateSystem}
        />
        <Route path={paths['inventory-detail']} component={DeviceDetail} />
        <Route
          path={paths['manage-images-detail-version']}
          component={ImageDetail}
        />
        <Route path={paths['manage-images-detail']} component={ImageDetail} />
        <Route path={paths['manage-images']} component={Images} />

        <Route exact path={paths['repositories']} component={Repositories} />

        <Route
          exact
          path={paths['learning-resources']}
          component={LearningResources}
        />
        <Route>
          <Redirect to={paths['fleet-management']} />
        </Route>
      </Switch>
    </Suspense>
  );
};
