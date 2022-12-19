import React, { useState } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { headerCol } from '@patternfly/react-table';
import { Button, Divider } from '@patternfly/react-core';
import { updateSystem } from '../../api/devices';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import apiWithToast from '../../utils/apiWithToast';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';

const filters = [
  { label: 'Version', type: 'text' },
  { label: 'Release', type: 'text' },
  { label: 'Additional packages', type: 'text' },
  { label: 'All packages', type: 'text' },
  { label: 'Systems running', type: 'text' },
  { label: 'Created', type: 'text' },
];

const columns = [
  {
    title: 'Version',
    cellTransforms: [headerCol('selectable-radio')],
  },
  { title: 'Release' },
  { title: 'Additional packages' },
  { title: 'All packages' },
  { title: 'Systems running' },
  { title: 'Created' },
];

const UpdateVersionTable = ({ data, isLoading, hasError }) => {
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedCommitID, setSelectedCommitID] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const buildRows = data?.map((rowData) => {
    const {
      version,
      release,
      additionalPackages,
      allPackages,
      systemsRunning,
      created,
      commitID,
      deviceUUID,
      deviceName,
    } = rowData;
    return {
      cells: [
        version,
        release,
        additionalPackages,
        allPackages,
        systemsRunning,
        created,
      ],
      commitID,
      deviceUUID,
      deviceName,
      selected: selectedVersion === version,
    };
  });

  const setUpdateEvent = (value) => {
    setSelectedVersion(value.cells[0]);
    setSelectedCommitID(value);
  };

  const handleUpdateEvent = () => {
    const statusMessages = {
      onInfo: {
        title: 'Updating system',
        description: ` ${selectedCommitID.deviceName} was added to the queue.`,
      },
      onError: {
        title: 'Error',
        description: `An error occurred making the request`,
      },
    };

    apiWithToast(
      dispatch,
      () =>
        updateSystem({
          CommitID: selectedCommitID.commitID,
          DevicesUUID: [selectedCommitID.deviceUUID],
        }),
      statusMessages
    );

    handleClose();
  };

  const handleClose = () => {
    history.push({
      pathname: history.state?.prevState
        ? history.state?.prevState
        : paths[history.location.pathname.split('/')[1]],
    });
  };

  return (
    <>
      <GeneralTable
        className="pf-u-mt-sm"
        apiFilterSort={true}
        isUseApi={false}
        loadTableData={() => buildRows}
        filters={filters}
        tableData={{
          count: data?.length,
          isLoading,
          hasError,
        }}
        columnNames={columns}
        rows={buildRows}
        defaultSort={{ index: 0, direction: 'desc' }}
        hasRadio={true}
        setRadioSelection={setUpdateEvent}
        isFooterFixed={true}
      />
      <div
        style={{
          background: 'white',
          left: '200px',
          position: 'fixed',
          height: '90px',
          width: '100%',
          bottom: '0px',
          paddingLeft: '80px',
          paddingBottom: '0px',
        }}
      >
        <Divider
          style={{ paddingBottom: '25px', width: '100%', paddingLeft: 0 }}
        />

        <Button
          style={{ left: '60px' }}
          key="confirm"
          variant="primary"
          isDisabled={!selectedVersion}
          onClick={() => handleUpdateEvent()}
        >
          Update system
        </Button>
        <Button
          style={{ left: '70px' }}
          key="cancel"
          variant="link"
          onClick={handleClose}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

UpdateVersionTable.propTypes = {
  data: PropTypes.array,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};
export default UpdateVersionTable;
