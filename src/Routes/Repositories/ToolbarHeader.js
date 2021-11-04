import React, { useEffect } from 'react';
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
  input,
  setInput,
  count,
  perPage,
  setPerPage,
  page,
  setPage,
}) => {
  useEffect(() => {
    setPage(1);
  }, [count]);

  return (
    <Toolbar id="toolbar">
      <ToolbarContent>
        <ToolbarItem>
          <InputGroup>
            <TextInput
              name="textInput1"
              id="textInput1"
              value={input}
              type="search"
              aria-label="search input example"
              placeholder="Filter by name"
              onChange={(value) => setInput(value)}
              iconVariant="search"
            />
          </InputGroup>
        </ToolbarItem>
        <ToolbarButtons buttons={toolbarButtons} />
        <ToolbarItem variant="pagination" align={{ default: 'alignRight' }}>
          <Pagination
            isCompact
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
  input: PropTypes.string,
  count: PropTypes.number,
  perPage: PropTypes.number,
  setPerPage: PropTypes.func,
  page: PropTypes.number,
  setPage: PropTypes.func,
};
export default ToolbarHeader;
