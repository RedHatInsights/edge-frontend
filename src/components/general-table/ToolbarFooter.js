import React from 'react';
import {
  Toolbar,
  Pagination,
  ToolbarItem,
  ToolbarContent,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const ToolbarFooter = ({ count, perPage, setPerPage, page, setPage }) => {
  return (
    <Toolbar id="toolbar">
      <ToolbarContent>
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          <Pagination
            data-testid="pagination-footer-test-id"
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

ToolbarFooter.propTypes = {
  count: PropTypes.number,
  perPage: PropTypes.number,
  setPerPage: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
};

export default ToolbarFooter;
