import React, { useState } from 'react';
import {
  Toolbar,
  Pagination,
  ToolbarItem,
  ToolbarContent,
  Button,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import FilterControls from './FilterControls';
import FilterChip from './FilterChips';

const ToolbarButtons = ({ buttons }) => {
  return buttons.map(({ title, click }, index) => (
    <ToolbarItem key={index}>
      <Button onClick={click} variant="primary">
        {title}
      </Button>
    </ToolbarItem>
  ));
};

const filters = [
  { label: 'Name', type: 'text' },
  {
    label: 'Distribution',
    type: 'checkbox',
    options: [{ option: '8.4' }, { option: '8.3' }],
  },
  {
    label: 'Status',
    type: 'checkbox',
    options: [{ option: 'BUILDING' }, { option: 'CREATED' }],
  },
];

const filterValues = () =>
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

const ToolbarHeader = ({
  toolbarButtons,
  input,
  setInput,
  count,
  perPage,
  setPerPage,
  page,
  setPage,
}) => {
  const [values, setValues] = useState(filterValues());
  return (
    <Toolbar id="toolbar">
      <ToolbarContent>
        <FilterControls
          filters={filters}
          filterValues={values}
          setFilterValues={setValues}
          setInput={setInput}
        />
        <ToolbarButtons buttons={toolbarButtons} />
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          <Pagination
            itemCount={count}
            perPage={perPage}
            page={page}
            onSetPage={(_e, pageNumber) => setPage(pageNumber)}
            widgetId="pagination-options-menu-top"
            onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
          />
        </ToolbarItem>
      </ToolbarContent>
      <ToolbarContent>
        <ToolbarItem variant="chip-group" spacer={{ default: 'spacerNone' }}>
          <FilterChip filterValues={values} setFilterValues={setValues} />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

ToolbarHeader.propTypes = {
  toolbarButtons: PropTypes.array,
  setInput: PropTypes.func,
  input: PropTypes.string,
  count: PropTypes.number,
  perPage: PropTypes.number,
  setPerPage: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
};
export default ToolbarHeader;
