import React from 'react';
import {
  Toolbar,
  Pagination,
  ToolbarItem,
  ToolbarContent,
  Button,
} from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
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

const ToolbarHeader = ({
  toolbarButtons,
  filters,
  setFilterValues,
  filterValues,
  chipsArray,
  setChipsArray,
  isLoading,
  count,
  perPage,
  setPerPage,
  page,
  setPage,
}) => {
  return (
    <Toolbar id="toolbar" data-testid="toolbar-header-testid">
      <ToolbarContent>
        <FilterControls
          filters={filters}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
        />
        <ToolbarButtons buttons={toolbarButtons} />
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          {isLoading ? (
            <Skeleton size={SkeletonSize.xs} />
          ) : (
            <Pagination
              data-testid="pagination-header-test-id"
              itemCount={count}
              perPage={perPage}
              page={page}
              onSetPage={(_e, pageNumber) => setPage(pageNumber)}
              widgetId="pagination-options-menu-top"
              onPerPageSelect={(_e, perPage) => setPerPage(perPage)}
              isCompact
            />
          )}
        </ToolbarItem>
      </ToolbarContent>
      <ToolbarContent>
        <ToolbarItem variant="chip-group" spacer={{ default: 'spacerNone' }}>
          <FilterChip
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            chipsArray={chipsArray}
            setChipsArray={setChipsArray}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  );
};

ToolbarHeader.propTypes = {
  filters: PropTypes.array,
  toolbarButtons: PropTypes.array,
  setFilterValues: PropTypes.func,
  filterValues: PropTypes.array,
  input: PropTypes.string,
  count: PropTypes.number,
  perPage: PropTypes.number,
  setPerPage: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
  chipsArray: PropTypes.array,
  setChipsArray: PropTypes.func,
  isLoading: PropTypes.bool,
};
export default ToolbarHeader;
