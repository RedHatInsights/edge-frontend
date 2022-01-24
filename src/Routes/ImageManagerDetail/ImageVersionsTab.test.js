import React from 'react';
import { render, screen } from '@testing-library/react';
import ImageVersionsTab from './ImageVersionsTab';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init, RegistryContext } from '../../store';

describe('ImageVersionsTab', () => {
  it('renders correctly', async () => {
    const openUpdateWizard = jest.fn()
    const imageData = {
      data: {
        Data: {
          images: [
            {
              image: {
                ID: 100,
                Version: 1,
                ImageType: "rhel-edge-installer",
                CreatedAt: "2022-01-24T18:27:24.331554Z",
                Status: "BUILDING",
                Installer: {
                  ImageBuildISOURL: ""
                }
              }
            },
            {
              image: {
                ID: 200,
                Version: 2,
                ImageType: "rhel-edge-installer",
                CreatedAt: "2022-01-24T18:27:24.331554Z",
                Status: "BUILDING",
                Installer: {
                  ImageBuildISOURL: ""
                }
              }
            },
          ],
          image_set: {
            ID: 101
          }
        }
      }
    }

    const registry = init(logger);

    render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <ImageVersionsTab imageData={imageData} openUpdateWizard={openUpdateWizard} />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByRole('button', {name: 'Options menu'})).toBeDefined()
    expect(screen.getByRole('cell', {name: '1'})).toBeDefined()
    expect(screen.getByRole('cell', {name: '2'})).toBeDefined()
    expect(screen.getAllByRole('cell', {name: 'RHEL for Edge Installer (.iso)'})).toHaveLength(2)
    expect(screen.getAllByText(/ago/i)).toBeDefined()
    expect(screen.getAllByRole('cell', {name: 'Image build in progress'})).toHaveLength(2)
  });
});
