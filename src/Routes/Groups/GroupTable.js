import React from 'react';
import PropTypes from 'prop-types';
import GeneralTable from '../../components/general-table/GeneralTable';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import { Tooltip } from '@patternfly/react-core';

const filters = [
  {
    label: 'Name',
    type: 'text',
  },
  {
    label: 'Image',
    type: 'text',
  },
];

const columns = [
  { title: 'Name', type: 'name', sort: true },
  { title: 'Systems', type: 'name', sort: false },
  { title: 'Image', type: 'name', sort: false },
];

const GroupTable = ({
  data,
  count,
  isLoading,
  hasError,
  handleCreateModal,
  handleRenameModal,
  handleDeleteModal,
}) => {
  const actionResolver = (rowData) => {
    const { id, title } = rowData;
    return (
      id && [
        {
          title: 'Rename',
          onClick: () => handleRenameModal(id, title),
        },
        {
          title: 'Delete',
          onClick: () => handleDeleteModal(id, title),
        },
      ]
    );
  };

  const buildRows = data?.map((rowData) => {
    const { ID, Name, Devices } = rowData?.DeviceGroup;
    let { DevicesImageInfo } = rowData;
    if (!DevicesImageInfo) {
      DevicesImageInfo = [];
    }
    const systems = Devices ?? [];
    const image = (
      <div>
        <Tooltip
          content={
            <div>
              {DevicesImageInfo.map((device, index) => (
                <p key={index}>{device.Name}</p>
              ))}
            </div>
          }
        >
          <span>Multiple images</span>
        </Tooltip>
      </div>
    );

    return {
      rowInfo: {
        id: ID,
        title: Name,
        image: ID === 3448 ? 'Multiple images' : 'Golden image',
      },
      noApiSortFilter: [
        Name,
        '',
        ID === 3448 ? 'Multiple images' : 'Golden image',
      ],
      cells: [
        {
          title: <Link to={`${paths['fleet-management']}/${ID}`}>{Name}</Link>,
        },
        {
          title: systems.length,
        },
        {
          title:
            DevicesImageInfo.length === 0
              ? '-'
              : DevicesImageInfo.length > 1
              ? image
              : DevicesImageInfo[0]?.Name,
        },
      ],
    };
  });

  return (
    <>
      <GeneralTable
        apiFilterSort={false}
        filters={filters}
        tableData={{
          count,
          data,
          isLoading,
          hasError,
        }}
        columnNames={columns}
        rows={buildRows}
        actionResolver={actionResolver}
        areActionsDisabled={() => false}
        defaultSort={{ index: 0, direction: 'desc' }}
        emptyFilterState={{
          title: 'No matching groups found',
          body: 'To continue, edit your filter settings and try again',
        }}
        toolbarButtons={[
          {
            title: 'Create group',
            click: handleCreateModal,
          },
        ]}
      />
    </>
  );
};

GroupTable.propTypes = {
  data: PropTypes.array,
  count: PropTypes.number,
  openModal: PropTypes.func,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  handleRenameModal: PropTypes.func,
  handleDeleteModal: PropTypes.func,
  handleCreateModal: PropTypes.func,
};

export default GroupTable;
