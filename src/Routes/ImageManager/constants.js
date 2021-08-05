export const transformPaginationParams = ({ perPage, page }) => ({
  limit: perPage,
  offset: (page - 1) * perPage,
});

export const transformFilters = (filters) => {
  const f = filters.reduce((acc, filter) => {
    if (!filter.chipKey || filter.chips.length === 0) {
      return acc;
    }
    return {
      ...acc,
      [filter.chipKey]: filter.chips.map((chip) => chip.value),
    };
  }, {});
  return f;
};

export const transformSort = ({ direction, name }) => {
  return {
    sort_by: direction === 'asc' ? name : `-${name}`,
  };
};

export const getFilterDep = (filter = undefined) => {
  return filter?.chips?.map((chip) => chip.value).join('.') || undefined;
};
