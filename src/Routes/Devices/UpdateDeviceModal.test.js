import React from 'react';
import UpdateDeviceModal from './UpdateDeviceModal';
import { Provider } from 'react-redux';
import { init, RegistryContext } from '../../store';
import { screen, render } from '@testing-library/react';
import logger from 'redux-logger';
import { MemoryRouter } from 'react-router-dom';

describe('ImageSets table', () => {
  it('to render correctly', async () => {
    const registry = init(logger);
    const setUpdateModal = jest.fn();
    const refreshTable = jest.fn();

    const singleUpdateModal = {
      isOpen: true,
      imageData: { Image: { Name: 'test_image', Version: 2 } },
      deviceData: [{ id: 100, display_name: 'test_device' }],
    };
    const multipleUpdateModal = {
      isOpen: true,
      imageData: { Image: { Name: 'test_image', Version: 3 } },
      deviceData: [
        { id: 100, display_name: 'test_device' },
        { id: 101, display_name: 'test_device2' },
      ],
    };

    const { container, rerender } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <UpdateDeviceModal
            updateModal={singleUpdateModal}
            setUpdateModal={setUpdateModal}
            refreshTable={refreshTable}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(
      screen.getByText(singleUpdateModal.deviceData[0].display_name)
    ).toBeDefined();
    expect(screen.getAllByRole('heading', 'Update to verion 2'));
    expect(screen.getAllByRole('heading', 'Changes from verion 1'));

    rerender(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <UpdateDeviceModal
            updateModal={multipleUpdateModal}
            setUpdateModal={setUpdateModal}
            refreshTable={refreshTable}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(screen.getByText('2 systems')).toBeDefined();
    expect(screen.getAllByRole('heading', 'Update to verion 2'));
    expect(screen.getAllByRole('heading', 'Changes from verion 1'));
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
