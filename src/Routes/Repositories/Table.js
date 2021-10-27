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

const Table = ({ toggle, columns, rows }) => {
  return (
    <React.Fragment>
      <TableComposable aria-label="Simple table" variant="compact">
        <Thead>
          <Tr>
            {columns.map((column, columnIndex) => (
              <Th key={columnIndex}>{column}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map(({ id, name, baseURL }, rowIndex) => (
            <Tr key={rowIndex}>
              <Td key={`${rowIndex}_0`} dataLabel={columns[0]}>
                <Text className="pf-u-mb-xs" component={TextVariants.p}>
                  {name}
                </Text>
                <Text component={TextVariants.a}>
                  {baseURL} <ExternalLinkAltIcon className="pf-u-ml-sm" />
                </Text>
              </Td>
              <Td
                actions={{
                  items: [
                    {
                      title: 'Edit',
                      onClick: () =>
                        toggle({
                          type: 'edit',
                          id,
                          name,
                          baseURL,
                        }),
                    },
                    {
                      title: 'Remove',
                      onClick: () =>
                        toggle({
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
  toggle: PropTypes.func,
};
export default Table;
