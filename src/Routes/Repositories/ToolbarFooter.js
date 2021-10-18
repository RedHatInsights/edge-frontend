import React from 'react';
import {
  Toolbar,
  Pagination,
  ToolbarItem,
  ToolbarContent,
} from '@patternfly/react-core';

const ToolbarFooter = () => {
  return (
    <Toolbar id="toolbar">
      <ToolbarContent>
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          <Pagination
            itemCount={37}
            //perPage={this.state.perPage}
            //page={this.state.page}
            //onSetPage={this.onSetPage}
            //widgetId='pagination-options-menu-top'
            //onPerPageSelect={this.onPerPageSelect}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

export default ToolbarFooter;
