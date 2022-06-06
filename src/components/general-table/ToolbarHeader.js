import React from 'react';
import {
  Toolbar,
  Pagination,
  ToolbarItem,
  ToolbarContent,
  Button,
  ToggleGroup,
  ToggleGroupItem,
  Skeleton,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import FilterControls from './FilterControls';
import FilterChip from './FilterChips';
import ToolbarKebab from './ToolbarKebab';

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
  toggleButton,
  toggleAction,
  toggleState,
  children,
  kebabItems,
}) => {
  return (
    <Toolbar id="toolbar-header" data-testid="toolbar-header-testid">
      <ToolbarContent>
        <FilterControls
          filters={filters}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
        >
          {children}
        </FilterControls>
        {toolbarButtons && <ToolbarButtons buttons={toolbarButtons} />}
        {toggleButton && (
          <ToggleGroup>
            {toggleButton.map((btn) => (
              <ToggleGroupItem
                key={btn.key}
                text={btn.title}
                isSelected={toggleState === btn.key}
                onChange={() => toggleAction(btn.key)}
              />
            ))}
          </ToggleGroup>
        )}
        {kebabItems && <ToolbarKebab kebabItems={kebabItems} />}
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          {isLoading ? (
            <Skeleton width="200px" />
          ) : count > 0 ? (
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
          ) : null}
        </ToolbarItem>
      </ToolbarContent>
      <ToolbarContent>
        <ToolbarItem variant="chip-group" spacer={{ default: 'spacerNone' }}>
          <FilterChip
            filterValues={filterValues}
            setFilterValues={setFilterValues}
            chipsArray={chipsArray}
            setChipsArray={setChipsArray}
            setPage={setPage}
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
  toggleButton: PropTypes.array,
  toggleAction: PropTypes.func,
  toggleState: PropTypes.number,
  children: PropTypes.element,
  kebabItems: PropTypes.array,
};
export default ToolbarHeader;
