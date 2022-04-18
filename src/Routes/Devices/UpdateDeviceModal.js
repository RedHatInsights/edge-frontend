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
  const isMultiple = updateModal.deviceData.length > 1;
  const deviceId = updateModal.deviceData.map((device) => device.id);
  const deviceName = isMultiple
    ? updateModal.deviceData.map((device) => device.display_name)
    : updateModal?.deviceData[0]?.display_name;

  const handleUpdateModal = async () => {
    try {
      await updateDeviceLatestImage({
        DevicesUUID: deviceId,
        CommitId: imageData?.Image?.CommitID,
      });
      dispatch({
        ...addNotification({
          variant: 'info',
          title: 'Updating device',
          description: isMultiple
            ? ` ${deviceName.length} systems were added to the queue.`
            : ` ${deviceName} was added to the queue.`,
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

  const Description = () => (
    <TextContent>
      <Text>
        Update{' '}
        <span className="pf-u-font-weight-bold pf-u-font-size-md">
          {isMultiple ? `${deviceName.length} systems` : deviceName}
        </span>{' '}
        to latest version of the image linked to it.
      </Text>
    </TextContent>
  );

  const updateToDetails = {
    title: `Update to version ${imageData?.Image.Version}`,
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
    title: `Changes from version ${imageData?.Image.Version - 1}`,
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
        label: Description(),
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'update-details',
        label: BuildModalReview({
          reviewObject: updateToDetails,
          key: 'update-details',
        }),
      },
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'package-details',
        label: BuildModalReview({
          reviewObject: packageDetails,
          key: 'package-details',
        }),
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
      title={`Update system${isMultiple ? 's' : ''} to latest image version`}
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
    deviceData: PropTypes.array.isRequired,
    imageData: PropTypes.object,
  }).isRequired,
  setUpdateModal: PropTypes.func.isRequired,
};

export default UpdateDeviceModal;
