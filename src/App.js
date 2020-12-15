import PropTypes from 'prop-types';
import React, { useEffect, Fragment, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Routes } from './Routes';
import { Bullseye, Spinner } from '@patternfly/react-core';
import './App.scss';

import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications/';

const App = (props) => {
  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    insights.chrome.init();
    // TODO change this to your appname
    insights.chrome.identifyApp('groups');

    insights.chrome.on('APP_NAVIGATION', (event) =>
      this.props.history.push(`/${event.navId}`)
    );
    (async () => {
      await insights.chrome.auth.getUser();
      setIsLogged(true);
    })();
  }, []);

  return (
    <Fragment>
      <NotificationsPortal />
      {isLogged ? (
        <Routes childProps={props} />
      ) : (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      )}
    </Fragment>
  );
};

App.propTypes = {
  history: PropTypes.object,
};

export default withRouter(connect()(App));
