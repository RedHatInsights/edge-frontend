import React from 'react';
import { render, screen } from '@testing-library/react';
import RepositoryTable from './RepositoryTable';
import { init, RegistryContext } from '../../store';
import logger from 'redux-logger';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

describe('RepositoryTable', () => {
  it('renders correctly', () => {
    const registry = init(logger);

    const data = [
      {
        id: 1,
        name: 'test name 1',
        baseURL: 'test url 1',
      },
      {
        id: 2,
        name: 'test name 2',
        baseURL: 'test url 2',
      },
      {
        id: 3,
        name: 'test name 3',
        baseURL: 'test url 3',
      },
    ];

    const openModal = jest.fn();

    const { container } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <RepositoryTable data={data} openModal={openModal} />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(
      screen
        .getByRole('textbox', 'Select input for Name')
        .getAttribute('placeholder')
    ).toEqual('Filter by name');
    expect(screen.findByRole('button', 'Add repository')).toBeDefined();
    expect(screen.findByRole('button', 'Name')).toBeDefined();
    expect(screen.getAllByText(/test name/i)).toHaveLength(3);
    expect(screen.getAllByRole('link', /test url/i)).toHaveLength(3);

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
