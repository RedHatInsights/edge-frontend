import React, { useState } from 'react';
import { Button, Modal } from '@patternfly/react-core';
import DeviceTable from '../Devices/DeviceTable';
import PropTypes from 'prop-types';
import { addDevicesToGroup } from '../../api/groups';
import { getInventory } from '../../api/devices';
import useApi from '../../hooks/useApi';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const AddSystemsToGroupModal = ({
  groupId,
  closeModal,
  isOpen,
  reloadData,
  groupName,
}) => {
  const [response, fetchDevices] = useApi({
    api: getInventory,
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;
  const [deviceIds, setDeviceIds] = useState([]);
  const dispatch = useDispatch();

  const handleAddDevicesToGroup = () => {
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `System(s) have been added to ${groupName} successfully`,
      },
      onError: {
        title: 'Error',
        description: `An error occurred making the request`,
      },
    };

    apiWithToast(
      dispatch,
      () =>
        addDevicesToGroup(
          parseInt(groupId),
          deviceIds.map((device) => ({ ID: device.deviceID }))
        ),
      statusMessages
    );
    setTimeout(async () => await reloadData(), 500);
    closeModal();
  };

  return (
    <Modal
      id="add-systems-modal"
      title="Add systems"
      position="top"
      isOpen={isOpen}
      onClose={closeModal}
      variant="large"
      actions={[
        <Button
          isDisabled={deviceIds.length === 0}
          key="confirm"
          variant="primary"
          onClick={handleAddDevicesToGroup}
        >
          Add systems
        </Button>,
        <Button key="cancel" variant="link" onClick={closeModal}>
          Cancel
        </Button>,
      ]}
    >
      <DeviceTable
        selectedItems={setDeviceIds}
        skeletonRowQuantity={15}
        hasCheckbox={true}
        isLoading={isLoading}
        hasError={hasError}
        count={data?.count}
        data={data?.data?.devices || []}
        fetchDevices={fetchDevices}
        enforceEdgeGroups={data?.data?.enforce_edge_groups}
      />
    </Modal>
  );
};
AddSystemsToGroupModal.propTypes = {
  groupId: PropTypes.string,
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool,
  reloadData: PropTypes.func,
  groupName: PropTypes.string,
};

export default AddSystemsToGroupModal;
