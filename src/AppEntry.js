import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init, RegistryContext } from './store';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/helpers';
import logger from 'redux-logger';

const AppEntry = ({ hasLogger }) => {
  // Initialize reducer registry only at initial render.
  const registry = useMemo(() => (hasLogger ? init(logger) : init()), []);
  return (
    <RegistryContext.Provider
      value={{
        getRegistry: () => registry,
      }}
    >
      <Provider store={registry.getStore()}>
        <Router basename={getBaseName(window.location.pathname, 1)}>
          <App />
        </Router>
      </Provider>
    </RegistryContext.Provider>
  );
};

AppEntry.propTypes = {
  hasLogger: PropTypes.bool,
};

export default AppEntry;
