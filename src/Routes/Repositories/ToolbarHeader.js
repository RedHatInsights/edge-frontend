import React, { useState } from 'react';
import {
  Toolbar,
  Pagination,
  ToolbarItem,
  ToolbarContent,
  Button,
  InputGroup,
  TextInput,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import FilterControls from './FilterControls';

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
  { label: 'Distribution', type: 'checkbox' },
  {
    label: 'Status',
    type: 'checkbox',
    options: [{ label: 'BUILDING' }, { label: 'CREATED' }],
  },
];

const ToolbarHeader = ({
  toolbarButtons,
  setInput,
  count,
  perPage,
  setPerPage,
  page,
  setPage,
}) => {
  return (
    <Toolbar id="toolbar">
      <ToolbarContent>
        <FilterControls filters={filters} setInput={setInput} />
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
    </Toolbar>
  );
};

ToolbarHeader.propTypes = {
  toolbarButtons: PropTypes.array,
  setInput: PropTypes.func,
  count: PropTypes.number,
  perPage: PropTypes.number,
  setPerPage: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
};
export default ToolbarHeader;
