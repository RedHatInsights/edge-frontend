import React from 'react';
import { createRoot } from 'react-dom/client';
import InventoryApp from './AppEntry';

createRoot(<InventoryApp hasLogger />, document.getElementById('root'));
