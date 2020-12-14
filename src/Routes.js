import { Redirect, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Suspense } from 'react';
import { routes as paths } from '../package.json';
import { Bullseye, Spinner } from '@patternfly/react-core';

const Groups = React.lazy(() => import(/* webpackChunkName: "SamplePage" */ './Routes/Groups/Groups'));
const GroupsDetail = React.lazy(() => import(/* webpackChunkName: "SamplePage" */ './Routes/Groups/GroupsDetail'));

const InsightsRoute = ({ rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`, 'pf-c-page__main');
    root.setAttribute('role', 'main');

    return (<Route {...rest} />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = () => {
    return (
        <Suspense fallback={<Bullseye><Spinner size="xl" /></Bullseye>}>
            <Switch>
                <InsightsRoute path={paths.groups} component={Groups} rootClass='groupsPage' />
                <InsightsRoute path={paths['groups-detail']} component={GroupsDetail} rootClass='oopsPage' />
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
            push: PropTypes.func
        })
    })
};
