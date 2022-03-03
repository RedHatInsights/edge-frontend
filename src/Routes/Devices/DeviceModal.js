import React from 'react';
import Modal from '../../components/Modal';
import DeviceTable from '../Devices/DeviceTable';
import PropTypes from 'prop-types';
import { addDevicesToGroup } from '../../api/index';

const DeviceModal = ({ groupId, closeModal, isOpen, reloadData }) => {
  let stuff = [];
  const fn = (values) => {
    stuff = values;
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
          //selectedItems: (values) => setSelectedItems(values),
          selectedItems: fn,
          // addSystemsHandler: ,
          skeletonRowQuantity: 15,
        },
      }}
      schema={{
        fields: [{ component: 'device-table', name: 'device-table' }],
      }}
      onSubmit={() => {
        addDevicesToGroup(
          parseInt(groupId),
          stuff.map((device) => ({ ID: device.deviceID }))
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
