import React from 'react';
import ReactDOM from 'react-dom';
import InventoryApp from './AppEntry';
import logger from 'redux-logger';

ReactDOM.render(
  <InventoryApp logger={logger} />,
  document.getElementById('root')
);
