import React, { useState } from 'react';
import { Button, Modal } from '@patternfly/react-core';
import DeviceTable from '../Devices/DeviceTable';
import PropTypes from 'prop-types';
import { addDevicesToGroup } from '../../api/index';
import { getInventory } from '../../api';
import useApi from '../../hooks/useApi';

const AddSystemsToGroupModal = ({
  groupId,
  closeModal,
  isOpen,
  reloadData,
}) => {
  const [response] = useApi({ api: getInventory });
  const { data, isLoading, hasError } = response;
  const [deviceIds, setDeviceIds] = useState([]);

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
          onClick={() => {
            addDevicesToGroup(
              parseInt(groupId),
              deviceIds.map((device) => ({ ID: device.deviceID }))
            );
            setTimeout(async () => await reloadData(), 500);
            closeModal();
          }}
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
        data={data?.data || []}
      />
    </Modal>
  );
};
AddSystemsToGroupModal.propTypes = {
  groupId: PropTypes.string,
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool,
  reloadData: PropTypes.func,
};

export default AddSystemsToGroupModal;
