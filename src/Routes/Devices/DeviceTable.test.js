import React from 'react';
import DeviceTable from './DeviceTable';
import { Provider } from 'react-redux';
import { init, RegistryContext } from '../../store';
import { render, screen } from '@testing-library/react';
import logger from 'redux-logger';
import { MemoryRouter } from 'react-router-dom';

describe('ImageSets table', () => {
  it('to render correctly', async () => {
    const registry = init(logger);

    const { container } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <DeviceTable />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    // expect(screen.getByLabelText('Select row 0').checked).toBeFalsy();
    expect(screen.getByRole('button', { name: 'Options menu' })).toBeDefined();
    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
