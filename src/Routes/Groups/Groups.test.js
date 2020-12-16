import React from 'react';
import Groups from './Groups';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';

describe('Groups', () => {
  const mockStore = configureStore();
  it('should render correctly', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <MemoryRouter initialEntries={['/groups']}>
          <Route path="/groups">
            <Groups />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
