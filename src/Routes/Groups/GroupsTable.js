import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  cellWidth,
} from '@patternfly/react-table';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
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

const GroupsTable = () => {
  const [sortBy, setSortBy] = useState({});
  const groups = useSelector(({ groupsReducer }) => groupsReducer?.groups);
  return (
    <Table
      aria-label="Groups table"
      actions={[
        {
          title: 'Adopt',
          onClick: console.log,
        },
        {
          title: 'Reject',
          onClick: console.log,
        },
      ]}
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
            title: <SecureIcon isSecure={group?.is_secure} />,
          },
          {
            title: <DateFormat date={group?.last_seen} />,
          },
          {
            title: <StatusIcon status={group?.status} />,
          },
        ],
      }))}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

export default GroupsTable;
