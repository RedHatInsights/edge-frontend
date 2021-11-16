import React from "react";
import ImageSetsTable from './ImageSetsTable'
import { Provider } from 'react-redux';
import { init, RegistryContext } from '../../store';
import { render } from '@testing-library/react';
import logger from 'redux-logger';

describe('ImageSets table', () => {
  it('to render correctly', () => {
    const openCreateWizard = jest.fn()
    const openUpdateWizard = jest.fn()
    const registry = init(logger);

    const { debug, } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
        >
        <Provider store={registry.getStore()}>
          <ImageSetsTable 
            openCreateWizard={openCreateWizard}
            openUpdateWizard={openUpdateWizard}
          />
        </Provider>
      </RegistryContext.Provider>
    )

    debug()
  })
})