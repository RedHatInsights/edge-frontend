import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { RegistryContext } from './store';
import { Routes } from './Routes';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { NotificationPortal } from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import './App.scss';
import AuthModal from './components/AuthModal';
import {
  Alert,
  Bullseye,
  Button,
  Spinner,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

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

  const RHEM_DOCUMENTATION_URL =
    'https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/managing_device_fleets_with_the_red_hat_edge_manager/index';

  return (
    <Fragment>
      <NotificationPortal />
      <Alert
        variant="info"
        isInline
        title={<>Upcoming decommission of hosted Edge Management service</>}
        className="pf-v5-u-mt-sm pf-v5-u-mb-sm"
      >
        <TextContent>
          <Text>
            As of July 31, 2025, the hosted edge management service will no
            longer be supported. This means that pushing image updates to
            Immutable (OSTree) systems using the Hybrid Cloud Console will be
            discontinued For an alternative way to manage edge systems,
            customers are encouraged to explore Red Hat Edge Manager (RHEM).
          </Text>
          <Text>
            <Button
              component="a"
              target="_blank"
              variant="link"
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
              isInline
              href={RHEM_DOCUMENTATION_URL}
            >
              Red Hat Edge Manager (RHEM) documentation
            </Button>
          </Text>
        </TextContent>
      </Alert>
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
