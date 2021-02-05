import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  Title,
  EmptyStateBody,
  Button,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  cellWidth,
} from '@patternfly/react-table';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { StatusIcon, SecureIcon } from '../../components';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Name of group',
    transforms: [sortable, cellWidth('max')],
  },
  {
    title: 'Number of devices',
    transforms: [sortable],
  },
  {
    title: 'Secure',
    transforms: [sortable, cellWidth(10)],
  },
  {
    title: 'Last seen',
    transforms: [sortable, cellWidth(15)],
  },
  {
    title: 'Status',
    transforms: [sortable, cellWidth(10)],
  },
];

const GroupsTable = ({ onAddNewGroup }) => {
  const [sortBy, setSortBy] = useState({});
  const groups = useSelector(({ groupsReducer }) => groupsReducer?.groups);
  return (
    <Table
      aria-label="Groups table"
      {...(groups.length > 0 && {
        actions: [
          {
            title: 'Adopt',
            onClick: console.log,
          },
          {
            title: 'Reject',
            onClick: console.log,
          },
        ],
      })}
      cells={columns}
      sortBy={sortBy}
      onSort={(_e, index, direction) =>
        setSortBy(() => ({
          index,
          direction,
        }))
      }
      rows={
        groups.length > 0
          ? groups.map((group) => ({
              cells: [
                {
                  title: (
                    <Link to={`/groups/${group?.uuid}`}>{group?.name}</Link>
                  ),
                },
                group?.sensors?.length,
                {
                  title: <SecureIcon isSecure={group?.is_secure} />,
                },
                {
                  title: <DateFormat date={group?.last_seen} />,
                },
                {
                  title: <StatusIcon status={group?.status} />,
                },
              ],
            }))
          : [
              {
                cells: [
                  {
                    title: (
                      <Bullseye>
                        <EmptyState variant={EmptyStateVariant.full}>
                          <Title headingLevel="h5" size="lg">
                            No matching groups found
                          </Title>
                          <EmptyStateBody>
                            This filter criteria matches no groups. <br /> Try
                            changing your filter settings. Or adding new group.
                          </EmptyStateBody>
                          <Button variant="primary" onClick={onAddNewGroup}>
                            Add group
                          </Button>
                        </EmptyState>
                      </Bullseye>
                    ),
                    props: {
                      colSpan: columns.length + 1,
                    },
                  },
                ],
              },
            ]
      }
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

GroupsTable.propTypes = {
  onAddNewGroup: PropTypes.func,
};

export default GroupsTable;
