import React from 'react';
import FilterInput from './FilterInput';

import { render, fireEvent } from '@testing-library/react';

describe('Filter input', () => {
  it('checkbox input should render correctly', async () => {
    const filterValues = [
      {
        type: 'checkbox',
        label: 'Test 2',
        value: [
          {
            id: 'option0',
            isChecked: false,
            option: 'option 1',
            optionApiName: 'option-1',
          },
          { id: 'option1', isChecked: false, option: 'option 2' },
        ],
      },
    ];
    const setFilterValues = jest.fn();

    const { container, findByTestId, findByRole, findByText } = render(
      <FilterInput
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        input={filterValues[0].label}
      />
    );
    const filterInputElement = await findByTestId('filter-input-testid');
    const filterInputDropdown = await findByRole('button');

    expect(filterInputElement).toBeDefined();
    expect(filterInputDropdown).toBeDefined();
    fireEvent.click(filterInputDropdown);
    expect(await findByText('option 1')).toBeDefined();
    expect(await findByText('option 2')).toBeDefined();
    fireEvent.click(await findByRole('checkbox', { name: 'option 2' }));
    expect(setFilterValues).toHaveBeenCalled();

    expect(container.querySelector('div')).toMatchSnapshot();
  });

  it('text input should render correctly', async () => {
    const filterValues = [
      { type: 'text', label: 'Test 1', value: 'test-label' },
    ];
    const setFilterValues = jest.fn();

    const { container, findByTestId, findByPlaceholderText } = render(
      <FilterInput
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        input={filterValues[0].label}
      />
    );
    const filterInputElement = await findByTestId('filter-input-testid');
    const filterInput = await findByPlaceholderText('Filter by Test 1');

    expect(filterInputElement).toBeDefined();
    expect(filterInput.value).toEqual('test-label');
    fireEvent.change(filterInput, { target: { value: 'event-test' } });
    expect(filterInput.value).toEqual('event-test');

    expect(container.querySelector('div')).toMatchSnapshot();
  });
});
