import React, { useState, Suspense } from 'react';
import PropTypes from 'prop-types';
import GeneralTable from '../../components/general-table/GeneralTable';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import { Bullseye, Spinner, Tooltip } from '@patternfly/react-core';

const UpdateDeviceModal = React.lazy(() =>
  import('../Devices/UpdateDeviceModal')
);

const filters = [{ label: 'Name', type: 'text' }];

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
  fetchGroups,
}) => {
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });

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
        {
          title: 'Update',
          onClick: () => setUpdateModal((prevState) => ({
            ...prevState,
            isOpen: true,
          })),
        },
      ]
    );
  };

  const buildRows = data?.map((rowData) => {
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
      {updateModal.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateDeviceModal
            navigateBack={() => {
              history.push({ pathname: history.location.pathname });
              setUpdateModal((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
            refreshTable={fetchGroups}
          />
        </Suspense>
      )}
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
  fetchGroups: PropTypes.func,
};

export default GroupTable;
