import createFilterValues from './createFilterValues';

describe('createFilterValues', () => {
  it('returns filter values correctly', () => {
    const filter = [
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

    const filterValues = createFilterValues(filter);
    expect(filterValues).toEqual(
      expect.arrayContaining([
        { type: 'text', label: 'Test 1', value: '' },
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
      ])
    );
  });
});
