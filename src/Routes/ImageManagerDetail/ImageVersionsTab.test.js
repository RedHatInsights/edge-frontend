import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ImageVersionsTab from './ImageVersionsTab';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init, RegistryContext } from '../../store';

describe('ImageVersionsTab', () => {
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
          <ImageVersionsTab
            imageData={imageData}
            openUpdateWizard={openUpdateWizard}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByRole('button', { name: 'Options menu' })).toBeDefined();
    expect(screen.getByRole('cell', { name: '1' }).firstChild.getAttribute('href')).toEqual('/manage-images/101/versions/100/details');
    expect(screen.getByRole('cell', { name: '2' }).firstChild.getAttribute('href')).toEqual('/manage-images/101/versions/200/details');
    expect(
      screen.getAllByRole('cell', { name: 'RHEL for Edge Installer (.iso)' })
    ).toHaveLength(2);
    expect(screen.getAllByText(/ago/i)).toBeDefined();
    expect(
      screen.getByRole('cell', { name: 'Image build in progress' })
    ).toBeDefined();
    expect(screen.getByRole('cell', { name: 'Ready' })).toBeDefined();
    fireEvent.click(screen.getAllByRole('button', {name: /actions/i})[1])
    fireEvent.click(screen.getByRole('button', {name: /update image/i}))
    expect(openUpdateWizard).toBeCalled()
  });
});
