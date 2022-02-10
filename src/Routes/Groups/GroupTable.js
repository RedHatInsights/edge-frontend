import React from 'react';
import PropTypes from 'prop-types';
import GeneralTable from '../../components/general-table/GeneralTable';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';

const filters = [{ label: 'Name', type: 'text' }];

const columns = [{ title: 'Name', type: 'name', sort: true }];

const GroupTable = ({ data, isLoading, openModal, handleRenameModal }) => {
  const actionResolver = (rowData) => {
    const { id, title } = rowData;
    return [
      {
        title: 'Rename',
        onClick: () => handleRenameModal(id, { name: title }),
      },
    ];
  };

  const buildRows = data.map((rowData) => {
    const { ID, Name } = rowData;

    return {
      id: ID,
      title: Name,
      noApiSortFilter: [Name],
      cells: [
        {
          title: <Link to={`${paths['fleet-management']}/${ID}`}>{Name}</Link>,
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
        isLoading,
        hasError: false,
      }}
      columnNames={columns}
      rows={buildRows}
      emptyFilterIcon=""
      emptyFilterMessage="No matching groups found"
      emptyFilterBody="To continue, edit your filter settings and try again"
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
  handleRenameModal: PropTypes.func,
};

export default GroupTable;
