import React from 'react';
import {
  Modal,
  Button,
  Text,
  TextContent,
  TextListItem,
  TextList,
  TextVariants,
  TextListVariants,
  TextListItemVariants,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const UpdateDeviceModal = ({ updateModal, setUpdateModal }) => {
  const handleUpdateModal = () => {
    setUpdateModal((prevState) => {
      return {
        ...prevState,
        isOpen: false,
      };
    });
  };

  return (
    <Modal
      variant="medium"
      title={`Update ${updateModal.deviceName} to latest image`}
      description="Update this device to use the latest version of the image linked to it."
      isOpen={updateModal.isOpen}
      onClose={handleUpdateModal}
      actions={[
        <Button key="confirm" variant="primary" onClick={handleUpdateModal}>
          Update Device
        </Button>,
        <Button key="cancel" variant="link" onClick={handleUpdateModal}>
          Cancel
        </Button>,
      ]}
    >
      <TextContent>
        <TextListItem component={TextVariants.h3}>
          <Text component={'b'}>Update to</Text>
        </TextListItem>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>
            Image Name
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            Controller
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Version
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>2</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Created
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            18 Jun 2021
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Release
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            RHEL 8.4
          </TextListItem>
        </TextList>
        <TextListItem component={TextVariants.h3}>
          <Text component={'b'}>Package Details</Text>
        </TextListItem>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>Added</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>3</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Removed
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>2</TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Updated
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>24</TextListItem>
        </TextList>
      </TextContent>
      <TextContent className="pf-u-pt-md">
        <Text
          style={{ color: 'var(--pf-global--palette--gold-500)' }}
          component="small"
        >
          <ExclamationTriangleIcon /> After the update is installed, the device
          will apply the changes.
        </Text>
      </TextContent>
    </Modal>
  );
};

UpdateDeviceModal.propTypes = {
  updateModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    imageId: PropTypes.number,
    deviceName: PropTypes.string.isRequired,
  }).isRequired,
  setUpdateModal: PropTypes.func.isRequired,
};

export default UpdateDeviceModal;
