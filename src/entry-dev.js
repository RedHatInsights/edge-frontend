import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import logger from 'redux-logger';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

console.log(getBaseName(window.location.pathname, 1));

ReactDOM.render(
    <Provider store={ init(logger).getStore() }>
        <Router basename={ getBaseName(window.location.pathname, 1) }>
            <App/>
        </Router>
    </Provider>,

    document.getElementById('root')
);
