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
import { StatusIcon } from '../../components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const columns = [
  {
    title: 'Name of device',
    transforms: [sortable, cellWidth('max')],
  },
  {
    title: 'Version',
    transforms: [sortable],
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

const DevicesTable = ({ uuid }) => {
  const [sortBy, setSortBy] = useState({});
  const devices = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.devices
  );
  return (
    <Table
      aria-label="Devices table"
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
      rows={devices.map((device) => ({
        cells: [
          {
            title: (
              <Link to={`/groups/${uuid}/${device?.uuid}`}>{device?.name}</Link>
            ),
          },
          device?.version,
          {
            title: <DateFormat date={device?.last_seen} />,
          },
          {
            title: <StatusIcon status={device?.status} />,
          },
        ],
      }))}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

DevicesTable.propTypes = {
  uuid: PropTypes.string,
};

export default DevicesTable;
