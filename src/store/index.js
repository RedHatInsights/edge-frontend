import { createContext } from 'react';
import { ReducerRegistry } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import promiseMiddleware from 'redux-promise-middleware';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { polling } from './polling';

export const RegistryContext = createContext({
  getRegistry: () => {},
});

export function init(...middleware) {
  return new ReducerRegistry({}, [
    promiseMiddleware,
    notificationsMiddleware({
      errorDescriptionKey: ['detail', 'stack'],
    }),
    polling(),
    ...middleware,
  ]);
}
