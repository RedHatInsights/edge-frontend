import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RegistryContext } from './store';
import { Routes } from './Routes';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';
import AuthModal from './components/AuthModal';

const App = (props) => {
  const { getRegistry } = useContext(RegistryContext);
  const [isLogged, setIsLogged] = useState(false);
  const history = useHistory();
  const [isAuth, setIsAuth] = useState(false);
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
      {isAuth && isLogged ? <Routes childProps={props} /> : <AuthModal />}
    </Fragment>
  );
};

export default App;
