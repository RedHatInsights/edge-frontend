import React from 'react';
import FilterDropdown from './FilterDropdown';

import { render, fireEvent } from '@testing-library/react';

describe('Filter dropdown', () => {
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
    const dropdown = {
      isOpen: true,
      selected: filters[0].label,
    };
    const setDropdown = jest.fn();

    const { findByTestId, findAllByText, findByText, findByRole } = render(
      <FilterDropdown
        dropdown={dropdown}
        setDropdown={setDropdown}
        filters={filters}
      />
    );

    const filterDropdown = await findByTestId('filter-dropdown-testid');
    const filterDropdownDefault = await findAllByText('Test 1');
    const filterDropdownButton = await findByRole('button');

    expect(filterDropdown).toBeDefined();
    expect(filterDropdownDefault).toBeDefined();
    fireEvent.click(filterDropdownButton);
    expect(setDropdown).toHaveBeenCalled();
    expect(await findByText('Test 2'));
  });
});
