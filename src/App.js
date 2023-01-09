import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RegistryContext } from './store';
import { Routes } from './Routes';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';
import AuthModal from './components/AuthModal';
import { Bullseye, Spinner } from '@patternfly/react-core';

const App = (props) => {
  const { getRegistry } = useContext(RegistryContext);
  const [isLogged, setIsLogged] = useState(false);
  const history = useHistory();
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
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

    (async () => {
      const data = await insights.chrome.auth.getUser();
      setIsAuth(data.entitlements.smart_management.is_entitled);
    })();

    return () => {
      registered();
    };
  }, []);

  return (
    <Fragment>
      <NotificationPortal />
      {isAuth && isLogged ? (
        <Routes childProps={props} />
      ) : isAuth === null ? (
        <Bullseye>
          <Spinner size="xl" />
        </Bullseye>
      ) : (
        <AuthModal />
      )}
    </Fragment>
  );
};

export default App;
