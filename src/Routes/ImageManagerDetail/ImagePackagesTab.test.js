import React from 'react';
import { render, screen } from '@testing-library/react';
import ImagePackagesTab from './ImagePackagesTab';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init, RegistryContext } from '../../store';

describe('ImagePackagesTab', () => {
  it('renders correctly', async () => {
    const imageVersion = {
      packages: 1,
      additional_packages: 1,
      image: {
        Packages: [
          {
            Name: 'Test package 1',
          },
        ],
        Commit: {
          Status: 'SUCCESS',
          InstalledPackages: [
            {
              name: 'Test package 2',
              arch: 'x86_64',
              release: '2.el8',
              version: '1.10.8',
            },
          ],
        },
      },
    };

    const registry = init(logger);

    const { container } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <ImagePackagesTab imageVersion={imageVersion} />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(
      screen.getByLabelText('Select input for name').getAttribute('placeholder')
    ).toEqual('Filter by name');
    expect(screen.getByRole('button', { name: 'Additional' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'All' })).toBeDefined();
    expect(screen.getByText(/test package 2/i)).toBeDefined();
    expect(() => screen.getByText(/test package 1/i)).toThrow();
    expect(
      screen
        .getByRole('link', { name: /more information/i })
        .getAttribute('href')
    ).toContain('Test package 2');

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
