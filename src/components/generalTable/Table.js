import React from 'react';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@patternfly/react-table';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const Table = ({
  columns,
  rows,
  sortDirection,
  setSortDirection,
  actionFunction,
}) => {
  return (
    <React.Fragment>
      <TableComposable aria-label="Simple table" variant="compact">
        <Thead>
          <Tr>
            {columns.map((column, columnIndex) => (
              <Th
                sort={{
                  sortBy: { direction: sortDirection },
                  onSort: () =>
                    setSortDirection((prevState) =>
                      prevState === 'asc' ? 'desc' : 'asc'
                    ),
                }}
                key={columnIndex}
              >
                {column}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map(({ id, name, baseURL }, rowIndex) => (
            <Tr key={rowIndex}>
              <Td key={`${rowIndex}_0`} dataLabel={columns[0]}>
                <Text classname="pf-u-mb-xs" component={TextVariants.p}>
                  {name}
                </Text>
                <Text component={TextVariants.a}>
                  <a href={baseURL}>{baseURL}</a>{' '}
                  <ExternalLinkAltIcon classname="pf-u-ml-sm" />
                </Text>
              </Td>
              <Td
                actions={{
                  items: [
                    {
                      title: 'Edit',
                      onClick: () =>
                        actionFunction({
                          type: 'edit',
                          id,
                          name,
                          baseURL,
                        }),
                    },
                    {
                      title: 'Remove',
                      onClick: () =>
                        actionFunction({
                          type: 'remove',
                          id,
                          name,
                          baseURL,
                        }),
                    },
                  ],
                }}
              />
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </React.Fragment>
  );
};

Table.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array,
  actionFunction: PropTypes.func,
  sortDirection: PropTypes.string,
  setSortDirection: PropTypes.func,
};
export default Table;
