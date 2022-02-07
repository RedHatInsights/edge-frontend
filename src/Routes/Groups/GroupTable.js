import React from 'react';
import PropTypes from 'prop-types';
import GeneralTable from '../../components/general-table/GeneralTable';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';

const filters = [{ label: 'Name', type: 'text' }];

const columns = [
  { title: 'Name', type: 'name', sort: true },
  //{ title: 'Systems', type: 'name', sort: false },
  //{ title: 'Image', type: 'name', sort: false },
  //{ title: 'Status', type: 'name', sort: false },
];

const GroupTable = ({ data, isLoading, openModal }) => {
  const actionResolver = () => {
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
    const { ID, Name } = rowData;
    return {
      noApiSortFilter: [Name],
      cells: [
        {
          title: <Link to={`${paths['fleet-management']}/${ID}`}>{Name}</Link>,
        },
        //{
        //  title: systems,
        //},
        //{
        //  title: image,
        //},
        //{
        //  title: status,
        //},
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
        isLoading,
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

GroupTable.propTypes = {
  data: PropTypes.array,
  openModal: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default GroupTable;
