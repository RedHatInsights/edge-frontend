import React from 'react';
import FilterControls from './FilterControls';

import { render } from '@testing-library/react';

describe('Filter controls', () => {
  it('should render correctly', async () => {
    const filters = [
      {
        label: 'Test 1',
        type: 'text',
      },
      {
        label: 'Test 2',
        type: 'text',
      },
    ];
    const filterValues = [
      { type: 'text', label: 'Test 1', value: 'test-label' },
    ];
    const setFilterValues = jest.fn();

    const { container, findByTestId, findByPlaceholderText } = render(
      <FilterControls
        filters={filters}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        checkBoxState={{hasCheckbox: false}}
        setCheckBoxState={() => jest.fn()}
      />
    );

    const filterInput = await findByTestId('filter-input-testid');
    const filterDropdown = await findByTestId('filter-dropdown-testid');
    const filterInputValue = await findByPlaceholderText('Filter by Test 1');

    expect(filterInput).toBeDefined();
    expect(filterDropdown).toBeDefined();
    expect(filterInputValue.value).toEqual('test-label');

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
