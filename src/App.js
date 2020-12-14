import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import './App.scss';

import { Provider } from 'react-redux';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import {
  NotificationsPortal,
  notifications,
} from '@redhat-cloud-services/frontend-components-notifications/';

const registry = getRegistry();
registry.register({ notifications });

const App = (props) => {
  useEffect(() => {
    insights.chrome.init();
    // TODO change this to your appname
    insights.chrome.identifyApp('groups');

    insights.chrome.on('APP_NAVIGATION', (event) =>
      this.props.history.push(`/${event.navId}`)
    );
  }, []);

  return (
    <Provider store={registry.getStore()}>
      <NotificationsPortal />
      <Routes childProps={props} />
    </Provider>
  );
};

App.propTypes = {
  history: PropTypes.object,
};

export default withRouter(connect()(App));
