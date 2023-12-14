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
        <Route exact path={paths.groupsDetail} component={GroupsDetail} />

        {/* <Route path={paths.deviceDetail} component={DeviceDetail} /> */}
        {/* <Route path={paths.canaries} component={Canaries} /> */}
        <Route exact path={paths.fleetManagement} component={Groups} />
        <Route
          exact
          path={paths.fleetManagementDetail}
          component={GroupsDetail}
        />
        <Route
          exact
          path={paths.fleetManagementSystemDetail}
          component={DeviceDetail}
        />
        <Route
          exact
          path={paths.fleetManagementSystemDetailUpdate}
          component={UpdateSystem}
        />
        <Route exact path={paths.inventory} component={Inventory} />
        <Route
          exact
          path={paths.inventoryDetailUpdate}
          component={UpdateSystem}
        />
        <Route path={paths.inventoryDetail} component={DeviceDetail} />
        <Route path={paths.inventoryDetailModal} component={DeviceDetail} />
        <Route path={paths.manageImagesDetailVersion} component={ImageDetail} />
        <Route path={paths.manageImagesDetail} component={ImageDetail} />
        <Route path={paths.manageImages} component={Images} />

        <Route exact path={paths.repositories} component={Repositories} />

        <Route
          exact
          path={paths.learningResources}
          component={LearningResources}
        />
        <Route>
          <Redirect to={paths.fleetManagement} />
        </Route>
      </Switch>
    </Suspense>
  );
};
