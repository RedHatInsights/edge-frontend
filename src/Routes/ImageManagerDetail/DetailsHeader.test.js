import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DetailsHeader from './DetailsHeader';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init, RegistryContext } from '../../store';

describe('DetailsHeader', () => {
  it('renders correctly', async () => {
    const openUpdateWizard = jest.fn();
    const imageData = {
      data: {
        Data: {
          images: [
            {
              image: {
                ID: 100,
                Version: 1,
                ImageType: 'rhel-edge-installer',
                CreatedAt: '2022-01-24T18:27:24.331554Z',
                UpdatedAt: '2022-01-24T18:27:24.331554Z',
                Status: 'BUILDING',
                Installer: {
                  ImageBuildISOURL: '',
                },
              },
            },
            {
              image: {
                ID: 200,
                Version: 2,
                ImageType: 'rhel-edge-installer',
                CreatedAt: '2022-01-24T18:27:24.331554Z',
                Status: 'SUCCESS',
                Installer: {
                  ImageBuildISOURL: 'test.com',
                },
              },
            },
          ],
          image_set: {
            ID: 101,
            Name: 'test image',
          },
        },
      },
    };

    const registry = init(logger);

    render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <DetailsHeader
            imageData={imageData}
            openUpdateWizard={openUpdateWizard}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getAllByRole('listitem')[0].children[0].innerHTML).toEqual(
      'Manage Images'
    );
    expect(screen.getAllByRole('listitem')[1].innerHTML).toContain(
      'test image'
    );
    expect(screen.getByRole('heading', { name: /test image/i })).toBeDefined();
    expect(screen.getByText(/last updated/i).children[0].innerHTML).toContain(
      'ago'
    );
    fireEvent.click(screen.getByRole('button', { name: /actions/i }));
    fireEvent.click(
      screen.getByRole('button', { name: /create new version/i })
    );
    expect(openUpdateWizard).toBeCalled();
  });
});
