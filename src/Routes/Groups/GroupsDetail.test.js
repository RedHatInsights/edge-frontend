import React from 'react';
import GroupsDetail from './GroupsDetail';
import { MemoryRouter, Route } from 'react-router-dom';
import { render } from '@testing-library/react';

describe('Groups', () => {
  it('should render correctly', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/groups/some-id']}>
        <Route path="/groups/:uuid">
          <GroupsDetail />
        </Route>
      </MemoryRouter>
    );
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
