import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RegistryContext } from './store';
import { Routes } from './Routes';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';

const App = (props) => {
  const { getRegistry } = useContext(RegistryContext);
  const [isLogged, setIsLogged] = useState(false);
  const history = useHistory();
  useEffect(() => {
    insights.chrome.init();
    // TODO change this to your appname
    insights.chrome.identifyApp('fleet-management');

    insights.chrome.on('APP_NAVIGATION', (event) =>
      history.push(`/${event.navId}`)
    );

    const registered = getRegistry().register({
      notifications: notificationsReducer,
    });

    (async () => {
      await insights.chrome.auth.getUser();
      setIsLogged(true);
    })();

    return () => registered();
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
