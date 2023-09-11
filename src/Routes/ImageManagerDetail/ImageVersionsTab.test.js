import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ImageVersionsTab from './ImageVersionsTab';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { init, RegistryContext } from '../../store';
import * as useApi from '../../hooks/useApi';

describe('ImageVersionsTab', () => {
  const imagesViewData = {
    count: 2,
    data: [
      {
        ID: 200,
        Version: 2,
        ImageType: 'rhel-edge-installer',
        CreatedAt: '2022-07-15T16:41:44.237455+02:00',
        Status: 'BUILDING',
        ImageBuildIsoURL: '',
      },
      {
        ID: 100,
        Version: 1,
        ImageType: 'rhel-edge-installer',
        CreatedAt: '2022-07-15T13:52:09.155502+02:00',
        Status: 'SUCCESS',
        ImageBuildIsoURL: 'test.com',
      },
    ],
  };

  const mockFetchData = jest.fn();

  beforeEach(() => {
    jest
      .spyOn(useApi, 'default')
      .mockImplementation(() => [
        { data: imagesViewData, isLoading: false, hasError: false },
        mockFetchData,
      ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders correctly', async () => {
    const openUpdateWizard = jest.fn();
    const imageData = {
      data: {
        ImageBuildIsoURL: 'test.com',
        ImageSet: {
          ID: 101,
        },
        LastImageDetails: {
          image: {
            ID: 200,
            Status: 'BUILDING',
            Version: 2,
            ImageType: 'rhel-edge-installer',
          },
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
          <ImageVersionsTab
            imageData={imageData}
            openUpdateWizard={openUpdateWizard}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    expect(mockFetchData.mock.calls.length).toBe(1);

    expect(screen.getByRole('button', { name: 'Options menu' })).toBeDefined();
    expect(
      screen
        .getByRole('cell', { name: '1' })
        .firstChild.getAttribute('target-href')
    ).toEqual('edge/manage-images/101/versions/100/details');
    expect(
      screen
        .getByRole('cell', { name: '2' })
        .firstChild.getAttribute('target-href')
    ).toEqual('edge/manage-images/101/versions/200/details');
    expect(
      screen.getAllByRole('cell', { name: 'RHEL for Edge Installer (.iso)' })
    ).toHaveLength(2);
    expect(screen.getAllByText(/ago/i)).toBeDefined();
    expect(
      screen.getByRole('cell', { name: 'Image build in progress' })
    ).toBeDefined();
    expect(screen.getByRole('cell', { name: 'Ready' })).toBeDefined();
    fireEvent.click(screen.getAllByRole('button', { name: /actions/i })[1]);
    // fireEvent.click(screen.getByRole('button', { name: /update image/i }));
    // expect(openUpdateWizard).toBeCalled();

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
