import React from 'react';
import Groups from './Groups';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';

describe('Groups', () => {
  const mockStore = configureStore();
  it('should render correctly', () => {
    const { container } = render(
      <Provider store={mockStore({})}>
        <Groups />
      </Provider>
    );
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
