import React from 'react';
import GeneralTable from './GeneralTable';

import { Provider } from 'react-redux';
import { init, RegistryContext } from '../../store';
import { render } from '@testing-library/react';
import logger from 'redux-logger';

import { MemoryRouter } from 'react-router-dom';
describe('General table', () => {
  it('should render correctly', async () => {
    const filters = [
      {
        label: 'Test 1',
        type: 'text',
      },
      {
        label: 'Test 2',
        type: 'checkbox',
        options: [
          { option: 'option 1', optionApiName: 'option-1' },
          { option: 'option 2' },
        ],
      },
    ];
    const columnNames = [
      { title: 'Name', type: 'name', sort: true },
      { title: 'Version', type: 'version', sort: false },
    ];
    const rows = [
      {
        cells: [{ Name: 'test-name' }, { Version: 'test-version' }],
      },
    ];
    const loadEdgeImages = jest.fn();
    const emptyStateAction = jest.fn();
    const actionResolver = jest.fn();
    const registry = init(logger);

    const { container, findByTestId, findByPlaceholderText } = render(
      <RegistryContext.Provider
        value={{
          getRegistry: () => registry,
        }}
      >
        <Provider store={registry.getStore()}>
          <GeneralTable
            apiFilterSort={false}
            filters={filters}
            loadTableData={loadEdgeImages}
            tableData={{
              count: 100,
              data: {},
              isLoading: false,
              hasError: false,
            }}
            columnNames={columnNames}
            rows={rows}
            emptyStateMessage="No data found"
            emptyStateActionMessage="Do something"
            emptyStateAction={emptyStateAction}
            actionResolver={actionResolver}
            areActionsDisabled={() => false}
            defaultSort={{ index: 5, direction: 'desc' }}
            toolbarButtons={[
              {
                title: 'test button',
                click: () => jest.fn(),
              },
            ]}
          />
        </Provider>
      </RegistryContext.Provider>,
      { wrapper: MemoryRouter }
    );

    const generalTableHeader = await findByTestId('toolbar-header-testid');
    const headerInput = await findByPlaceholderText('Filter by test 1');
    const generalTable = await findByTestId('general-table-testid');
    const generalTableFooter = await findByTestId('pagination-footer-test-id');

    expect(generalTableHeader).toBeDefined();
    expect(headerInput.value).toBeDefined();
    expect(generalTable).toBeDefined();
    expect(generalTableFooter).toBeDefined();
    expect(generalTableFooter.children[0].innerHTML).toEqual(
      '<b>1 - 1</b> of <b>1</b> '
    );

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
