import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RegistryContext } from './store';
import { Routes } from './Routes';
import { Bullseye, Spinner } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';
import { setPolling } from './store/actions';
import { pollingReducer } from './store/reducers';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';

const App = (props) => {
  const dispatch = useDispatch();
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
      pollingReducer,
      notifications: notificationsReducer,
    });
    dispatch(setPolling(true, 3 * 60 * 1000));
    (async () => {
      await insights.chrome.auth.getUser();
      setIsLogged(true);
    })();

    return () => {
      registered();
      dispatch(setPolling(false));
    };
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
