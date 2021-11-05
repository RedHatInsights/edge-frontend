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
import createFilterValues from '../../components/generalTable/createFilterValues';

const ToolbarButtons = ({ buttons }) => {
  console.log(buttons);
  return buttons.map(({ title, click }, index) => (
    <ToolbarItem key={index}>
      <Button onClick={click} variant="primary">
        {title}
      </Button>
    </ToolbarItem>
  ));
};

const ToolbarHeader = ({
  toolbarButtons,
  filters,
  setInput,
  count,
  perPage,
  setPerPage,
  page,
  setPage,
}) => {
  const [values, setValues] = useState(createFilterValues(filters));
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
  filters: PropTypes.func,
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
