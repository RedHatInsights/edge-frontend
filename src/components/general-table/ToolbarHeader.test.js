import React from 'react';
import ToolbarHeader from './ToolbarHeader';
import { render } from '@testing-library/react';

describe('Toolbar Header', () => {
  it('should render correctly', async () => {
    const toolbarButtons = [
      {
        title: 'Test toolbar button',
        click: () => jest.fn(),
      },
    ];
    const filters = [
      {
        label: 'Test 1',
        type: 'text',
      },
    ];
    const filterValues = [
      { type: 'text', label: 'Test 1', value: 'test-label' },
    ];
    const chipsArray = [{ key: 'Test 1', label: 'test-label' }];
    const setFilterValues = jest.fn();
    const setChipsArray = jest.fn();
    const setPage = jest.fn();
    const setPerPage = jest.fn();

    const { container, findByTestId, findByPlaceholderText, findByRole } =
      render(
        <ToolbarHeader
          count={100}
          toolbarButtons={toolbarButtons}
          filters={filters}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          chipsArray={chipsArray}
          setChipsArray={setChipsArray}
          isLoading={false}
          perPage={50}
          setPerPage={setPerPage}
          page={1}
          setPage={setPage}
          checkBoxState={{ hasCheckbox: false }}
          setCheckBoxState={() => jest.fn()}
        />
      );

    const headerElement = await findByTestId('toolbar-header-testid');
    const headerInput = await findByPlaceholderText('Filter by test 1');
    const headerButton = await findByRole('button', {
      name: 'Test toolbar button',
    });
    const paginationElement = await findByTestId('pagination-header-test-id');

    expect(headerElement).toBeDefined();
    expect(headerInput.value).toEqual('test-label');
    expect(headerButton).toBeDefined();
    expect(paginationElement.children[0].innerHTML).toEqual(
      '<b>1 - 20</b> of <b>100</b> '
    );

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
