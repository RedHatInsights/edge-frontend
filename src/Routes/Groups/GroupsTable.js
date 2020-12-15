import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
} from '@patternfly/react-table';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'Name of group',
    transforms: [sortable],
  },
  {
    title: 'Number of devices',
    transforms: [sortable],
  },
  {
    title: 'Secure',
    transforms: [sortable],
  },
  {
    title: 'Last seen',
    transforms: [sortable],
  },
  {
    title: 'Status',
    transforms: [sortable],
  },
];

const GroupsTable = () => {
  const [sortBy, setSortBy] = useState({});
  const groups = useSelector(({ groupsReducer }) => groupsReducer?.groups);
  return (
    <Table
      aria-label="Groups table"
      cells={columns}
      sortBy={sortBy}
      onSort={(_e, index, direction) =>
        setSortBy(() => ({
          index,
          direction,
        }))
      }
      rows={groups.map((group) => ({
        cells: [
          {
            title: <Link to={`/groups/${group?.uuid}`}>{group?.name}</Link>,
          },
          group?.sensors,
          {
            title: group?.is_secure ? 'secure' : 'non secure',
          },
          {
            title: new Date(group?.last_seen).toDateString(),
          },
          group?.status,
        ],
      }))}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default GroupsTable;
