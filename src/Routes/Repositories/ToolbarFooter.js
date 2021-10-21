import React from 'react';
import {
    Toolbar,
    Pagination,
    ToolbarItem,
    ToolbarContent,
} from '@patternfly/react-core';

const ToolbarFooter = ({ count, perPage, setPerPage, page }) => {
    return (
        <Toolbar id='toolbar'>
            <ToolbarContent>
                <ToolbarItem
                    variant='pagination'
                    align={{ default: 'alignRight' }}
                >
                    <Pagination
                        itemCount={count}
                        perPage={perPage}
                        page={page}
                        onSetPage={(_e, pageNumber) => setPage(pageNumber)}
                        widgetId='pagination-options-menu-top'
                        onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
                    />
                </ToolbarItem>
            </ToolbarContent>
        </Toolbar>
    );
};

export default ToolbarFooter;
