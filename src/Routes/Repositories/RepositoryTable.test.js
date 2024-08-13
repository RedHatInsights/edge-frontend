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
        ID: 1,
        Name: 'test name 1',
        URL: 'test url 1',
      },
      {
        ID: 2,
        Name: 'test name 2',
        URL: 'test url 2',
      },
      {
        ID: 3,
        Name: 'test name 3',
        URL: 'test url 3',
      },
    ];

    const closeModal = jest.fn();

    const { container } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <RepositoryTable
            isLoading={false}
            hasError={false}
            data={data}
            count={data.length}
            closeModal={closeModal}
            fetchRepos={() => data}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(
      screen.getByLabelText('Select input for name').getAttribute('placeholder')
    ).toEqual('Filter by name');
    expect(screen.findByRole('button', 'Add repository')).toBeDefined();
    expect(screen.findByRole('button', 'Name')).toBeDefined();
    expect(screen.getAllByText(/test name/i)).toHaveLength(3);
    expect(screen.getAllByRole('link', /test url/i)).toHaveLength(3);

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
