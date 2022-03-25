import React from 'react';
import { TextContent, Text } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { updateDeviceLatestImage } from '../../api/index';
import { useDispatch } from 'react-redux';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import Modal from '../../components/Modal';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import BuildModalReview from '../../components/BuildModalReview';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { distributionMapper } from '../ImageManagerDetail/constants';

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

  const WarningText = () => (
    <TextContent className="pf-u-pt-md">
      <Text
        style={{ color: 'var(--pf-global--palette--gold-500)' }}
        component="small"
      >
        <ExclamationTriangleIcon /> After the update is installed, the device
        will apply the changes.
      </Text>
    </TextContent>
  );

  const updateToDetails = {
    title: 'Update to',
    rows: [
      { title: 'Image Name', value: imageData?.Image.Name },
      { title: 'Version', value: imageData?.Image.Version },
      {
        title: 'Created',
        value: <DateFormat date={imageData?.Image.CreatedAt} />,
      },
      {
        title: 'Release',
        value: distributionMapper[imageData?.Image.Distribution],
      },
    ],
  };

  const packageDetails = {
    title: 'Package Details',
    rows: [
      { title: 'Added', value: imageData?.PackageDiff?.Added?.length || 0 },
      { title: 'Removed', value: imageData?.PackageDiff?.Removed?.length || 0 },
      { title: 'Updated', value: imageData?.PackageDiff?.Updated?.length || 0 },
    ],
  };

  const updateSchema = {
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'description',
        label:
          'Update this device to use the latest version of the image linked to it.',
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'update-details',
        label: BuildModalReview({ reviewObject: updateToDetails }),
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'update-details',
        label: BuildModalReview({ reviewObject: packageDetails }),
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'warning-text',
        label: WarningText(),
      },
    ],
  };

  return (
    <Modal
      size="medium"
      title={`Update ${deviceName} to latest image`}
      isOpen={updateModal.isOpen}
      openModal={() =>
        setUpdateModal((prevState) => ({ ...prevState, isOpen: false }))
      }
      submitLabel="Update Device"
      schema={updateSchema}
      onSubmit={handleUpdateModal}
      reloadData={refreshTable}
    />
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
