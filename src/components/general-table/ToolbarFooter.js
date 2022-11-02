import React from 'react';
import {
  Toolbar,
  Pagination,
  ToolbarItem,
  ToolbarContent,
  Skeleton,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const ToolbarFooter = ({
  isLoading,
  count,
  perPage,
  setPerPage,
  page,
  setPage,
  isFooterFixed,
}) => {
  const styles = {
    padding: '0',
  };

  if (isFooterFixed) {
    // styles.position = 'fixed';
    // styles.left = '0';
    // styles.bottom = '0';
    // styles.width = '100%';
    styles.paddingBottom = '30px';
    styles.paddingTop = '20px';
  }
  return (
    <Toolbar style={styles} id="toolbar-footer">
      <ToolbarContent>
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          {isLoading ? (
            <Skeleton width="400px" />
          ) : count > 0 ? (
            <Pagination
              data-testid="pagination-footer-test-id"
              itemCount={count}
              perPage={perPage}
              page={page}
              onSetPage={(_e, pageNumber) => setPage(pageNumber)}
              widgetId="pagination-options-menu-top"
              onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
            />
          ) : null}
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

ToolbarFooter.propTypes = {
  isLoading: PropTypes.bool,
  count: PropTypes.number,
  perPage: PropTypes.number,
  setPerPage: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
  isFooterFixed: PropTypes.bool,
};

export default ToolbarFooter;
