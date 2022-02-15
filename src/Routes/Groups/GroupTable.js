import React from 'react';
import PropTypes from 'prop-types';
import GeneralTable from '../../components/general-table/GeneralTable';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import { Tooltip } from '@patternfly/react-core';

const filters = [{ label: 'Name', type: 'text' }];

const columns = [
  { title: 'Name', type: 'name', sort: true },
  { title: 'Systems', type: 'name', sort: false },
  { title: 'Image', type: 'name', sort: false },
];

const GroupTable = ({
  data,
  isLoading,
  openModal,
  setIsModalOpen,
  handleRenameModal,
}) => {
  const actionResolver = (rowData) => {
    const { id, title } = rowData;
    return [
      {
        title: 'Rename',
        onClick: () => handleRenameModal(id, { name: title }),
      },
      {
        title: 'Delete',
        onClick: () => console.log('updating'),
      },
    ];
  };

  const buildRows = data.map((rowData) => {
    const { ID, Name, Devices } = rowData;
    const systems = Devices ?? [];

    // temp static data to show dif version of mockups
    const image = (
      <div>
        <Tooltip
          content={
            <div>
              <p>Golden Image</p>
              <p> Super Golden Image</p>
            </div>
          }
        >
          <span>Multiple images</span>
        </Tooltip>
      </div>
    );

    return {
      id: ID,
      title: Name,
      noApiSortFilter: [Name],
      cells: [
        {
          title: <Link to={`${paths['fleet-management']}/${ID}`}>{Name}</Link>,
        },
        {
          title: systems.length,
        },
        {
          title: ID === 1 ? image : 'Golden image',
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
        isLoading,
        hasError: false,
      }}
      columnNames={columns}
      rows={buildRows}
      emptyState={{
        icon: 'module',
        title: 'Create a system group',
        body: 'Create system groups to help manage your devices more effectively',
        primaryAction: {
          text: 'Create group',
          click: () => setIsModalOpen(true),
        },
      }}
      emptyFilterState={{
        message: 'No matching groups found',
        body: 'To continue, edit your filter settings and try again',
      }}
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
  setIsModalOpen: PropTypes.func,
  isLoading: PropTypes.bool,
  handleRenameModal: PropTypes.func,
};

export default GroupTable;
