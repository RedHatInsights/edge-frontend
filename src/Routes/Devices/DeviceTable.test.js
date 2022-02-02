import React from 'react';
import DeviceTable from './DeviceTable';
import { Provider } from 'react-redux';
import { init, RegistryContext } from '../../store';
import { render, screen } from '@testing-library/react';
import logger from 'redux-logger';

describe('ImageSets table', () => {
  it('to render correctly', async () => {
    const registry = init(logger);

    render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <DeviceTable />
        </Provider>
      </RegistryContext.Provider>
    );

    const headerArray = ['Name', 'Groups', 'Last Seen', 'Image', 'Status'];

    expect(screen.getByLabelText('Select row 0').checked).toBeFalsy();
    expect(
      screen.getAllByRole('columnheader').forEach((header, i) => {
        expect(header.innerHTML === headerArray[i]).toBeTruthy();
      })
    );
    expect(screen.getByRole('button', { name: 'Options menu' })).toBeDefined();
  });
});
