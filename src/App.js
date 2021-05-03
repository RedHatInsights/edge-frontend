import React, { useEffect, Fragment, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Routes } from './Routes';
import { Bullseye, Spinner } from '@patternfly/react-core';
import './App.scss';

import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';

const App = (props) => {
  const [isLogged, setIsLogged] = useState(false);
  const history = useHistory();
  useEffect(() => {
    insights.chrome.init();
    // TODO change this to your appname
    insights.chrome.identifyApp('fleet-management');

    insights.chrome.on('APP_NAVIGATION', (event) =>
      history.push(`/${event.navId}`)
    );
    (async () => {
      await insights.chrome.auth.getUser();
      setIsLogged(true);
    })();
  }, []);

  return (
    <Fragment>
      <NotificationPortal />
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

export default App;
