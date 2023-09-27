import React from 'react';
import Groups from './Groups';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { RegistryContext } from '../../store';

jest.mock('../../utils');

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
          <MemoryRouter initialEntries={['/fleet-managment']}>
            <Route path="/fleet-managment">
              <Groups />
            </Route>
          </MemoryRouter>
        </Provider>
      </RegistryContext.Provider>
    );
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
