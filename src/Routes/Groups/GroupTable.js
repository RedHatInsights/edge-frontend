import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';

const filters = [{ label: 'Name', type: 'text' }];

const columns = [
  { title: 'Group name', type: 'name', sort: true },
  { title: 'Systems', type: 'name', sort: false },
  { title: 'Image', type: 'name', sort: false },
  { title: 'Status', type: 'name', sort: false },
];

const GroupTable = ({ data, openModal }) => {
  const actionResolver = (rowData) => {
    return [
      {
        title: 'Update',
        onClick: () => console.log('updating'),
      },
      {
        title: 'Remove',
        onClick: () => console.log('updating'),
      },
    ];
  };

  const buildRows = data.map((rowData) => {
    const { id, name, systems, image, status } = rowData;
    console.log(rowData);
    return {
      noApiSortFilter: [name],
      cells: [
        {
          title: <Link to={`${paths['fleet-management']}/${id}`}>{name}</Link>,
        },
        {
          title: systems,
        },
        {
          title: image,
        },
        {
          title: status,
        },
      ],
    };
  });

  return (
    <GeneralTable
      apiFilterSort={false}
      filters={filters}
      tableData={{
        count: data.length,
        data,
        isLoading: false,
        hasError: false,
      }}
      columnNames={columns}
      rows={buildRows}
      actionResolver={actionResolver}
      areActionsDisabled={() => false}
      defaultSort={{ index: 0, direction: 'desc' }}
      toolbarButtons={[
        {
          title: 'Create group',
          click: openModal,
        },
      ]}
    />
  );
};

export default GroupTable;
