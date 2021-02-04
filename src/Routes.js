import { Redirect, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
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
        <Route>
          <Redirect to={paths.groups} />
        </Route>
      </Switch>
    </Suspense>
  );
};

Routes.propTypes = {
  childProps: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  }),
};
