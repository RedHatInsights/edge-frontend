import React from 'react';
import GroupsDetail from './GroupsDetail';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { init, RegistryContext } from '../../store';
import logger from 'redux-logger';

describe('Groups', () => {
  it('should render correctly', () => {
    const registry = init(logger);
    const { container } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <MemoryRouter initialEntries={['/fleet-managment/some-id']}>
            <Route path="/fleet-managment/:uuid">
              <GroupsDetail />
            </Route>
          </MemoryRouter>
        </Provider>
      </RegistryContext.Provider>
    );
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
