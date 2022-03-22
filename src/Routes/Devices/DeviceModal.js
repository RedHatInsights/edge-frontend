import React from 'react';
import Modal from '../../components/Modal';
import DeviceTable from '../Devices/DeviceTable';
import PropTypes from 'prop-types';
import { addDevicesToGroup } from '../../api/index';
import { getInventory } from '../../api';
import useApi from '../../hooks/useApi';

const DeviceModal = ({ groupId, closeModal, isOpen, reloadData }) => {
  const [response] = useApi(getInventory);
  const { data, isLoading, hasError } = response;
  let deviceIds = [];
  const getDeviceIds = (values) => {
    deviceIds = values;
  };

  return (
    <Modal
      isOpen={isOpen}
      openModal={closeModal}
      title="Add systems"
      submitLabel="Add systems"
      additionalMappers={{
        'device-table': {
          component: DeviceTable,
          selectedItems: getDeviceIds,
          skeletonRowQuantity: 15,
          hasCheckbox: true,
          isLoading,
          hasError,
          count: data?.count,
          data: data?.data || [],
        },
      }}
      schema={{
        fields: [{ component: 'device-table', name: 'device-table' }],
      }}
      onSubmit={() => {
        addDevicesToGroup(
          parseInt(groupId),
          deviceIds.map((device) => ({ ID: device.deviceID }))
        );
      }}
      reloadData={reloadData}
      size="large"
    />
  );
};
DeviceModal.propTypes = {
  // possibly remove some of these
  groupId: PropTypes.string,
  closeModal: PropTypes.func,
  isOpen: PropTypes.bool,
  reloadData: PropTypes.func,
};

export default DeviceModal;
