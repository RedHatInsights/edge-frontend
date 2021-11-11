const createFilterValues = (filters) =>
  filters.map((filter) => {
    const config = {
      type: filter.type,
      label: filter.label,
    };

    if (filter.type === 'text') config.value = filter.value || '';
    if (filter.type === 'checkbox')
      config.value = filter.options.map((option, index) => ({
        ...option,
        id: 'option' + index,
        isChecked: option.isChecked || false,
      }));
    return config;
  });

export default createFilterValues;
