import React from 'react';
import GroupsDetail from './GroupsDetail';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import { RegistryContext } from '../../store';

describe('Groups', () => {
  const mockStore = configureStore();
  it('should render correctly', () => {
    const { container } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => ({
            register: jest.fn(),
          }),
        }}
      >
        <Provider store={mockStore({})}>
          <MemoryRouter initialEntries={['/groups/some-id']}>
            <Route path="/groups/:uuid">
              <GroupsDetail />
            </Route>
          </MemoryRouter>
        </Provider>
      </RegistryContext.Provider>
    );
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
