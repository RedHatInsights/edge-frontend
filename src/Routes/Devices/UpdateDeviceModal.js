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
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { distributionMapper } from '../ImageManagerDetail/constants';
import PropTypes from 'prop-types';
import { updateDeviceLatestImage } from '../../api/index';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const UpdateDeviceModal = ({ updateModal, setUpdateModal, refreshTable }) => {
  const dispatch = useDispatch();
  const imageData = updateModal?.imageData;
  const deviceId = updateModal?.deviceData?.id;
  const deviceName = updateModal?.deviceData?.display_name;

  const handleUpdateModal = async () => {
    try {
      await updateDeviceLatestImage({
        DeviceUUID: deviceId,
        CommitId: imageData?.Image?.CommitID,
      });
      dispatch({
        ...addNotification({
          variant: 'info',
          title: 'Updating device',
          description: ` ${deviceName} was added to the queue.`,
        }),
      });
    } catch (err) {
      dispatch({
        ...addNotification({
          variant: 'danger',
          title: 'Updating a device was unsuccessful',
          description: `Response: ${err.statusText}`,
        }),
      });
    }

    handleClose();
    refreshTable ? refreshTable() : null;
  };

  const handleClose = () => {
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
      title={`Update ${deviceName} to latest image`}
      description="Update this device to use the latest version of the image linked to it."
      isOpen={updateModal.isOpen}
      onClose={handleClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={handleUpdateModal}>
          Update Device
        </Button>,
        <Button key="cancel" variant="link" onClick={handleClose}>
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
            {imageData?.Image.Name}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Version
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {imageData?.Image.Version}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Created
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            <DateFormat date={imageData?.Image.CreatedAt} />
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Release
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {distributionMapper[imageData?.Image.Distribution]}
          </TextListItem>
        </TextList>
        <TextListItem component={TextVariants.h3}>
          <Text component={'b'}>Package Details</Text>
        </TextListItem>
        <TextList component={TextListVariants.dl}>
          <TextListItem component={TextListItemVariants.dt}>Added</TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {imageData?.PackageDiff?.Added?.length || 0}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Removed
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {imageData?.PackageDiff?.Removed?.length || 0}
          </TextListItem>
          <TextListItem component={TextListItemVariants.dt}>
            Updated
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {imageData?.PackageDiff?.Updated?.length || 0}
          </TextListItem>
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
  refreshTable: PropTypes.func,
  updateModal: PropTypes.shape({
    isOpen: PropTypes.bool.isRequired,
    deviceData: PropTypes.object.isRequired,
    imageData: PropTypes.object,
  }).isRequired,
  setUpdateModal: PropTypes.func.isRequired,
};

export default UpdateDeviceModal;
