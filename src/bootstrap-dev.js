import React from 'react';
import ReactDOM from 'react-dom';
import InventoryApp from './AppEntry';
import logger from 'redux-logger';

console.log(document.getElementById('root'), 'This is root element');
console.log(insights?.chrome, 'this is chrome!');

ReactDOM.render(
  <InventoryApp logger={logger} />,
  document.getElementById('root')
);
