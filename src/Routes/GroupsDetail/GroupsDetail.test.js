import React from 'react';
import GroupsDetail from './GroupsDetail';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

describe('Groups', () => {
  const mockStore = configureStore();
  it('should render correctly', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <MemoryRouter initialEntries={['/groups/some-id']}>
          <Route path="/groups/:uuid">
            <GroupsDetail />
          </Route>
        </MemoryRouter>
      </Provider>
    );
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
