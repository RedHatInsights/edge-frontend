import React from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import SearchInput from '../../components/SearchInput';
import apiWithToast from '../../utils/apiWithToast';
import { removeDeviceFromGroupById } from '../../api/groups';
import { useDispatch } from 'react-redux';
import { Text } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

const removeDescription = (deviceInfo) => {
  const { deviceGroups } = deviceInfo[0];

  const systemText =
    deviceInfo.length > 1 ? `${deviceInfo.length} systems` : deviceInfo[0].name;
  const groupText =
    deviceGroups.length === 1
      ? deviceGroups[0].Name
      : `${deviceGroups.length} groups`;
  if (deviceGroups.length > 1) {
    return (
      <Text>
        Select the group you want to remove <strong>{systemText}</strong> from.
      </Text>
    );
  }

  return (
    <Text>
      Do you want to remove <strong>{systemText} </strong> from{' '}
      <strong>{groupText}</strong>?
    </Text>
  );
};

const WarningIcon = () => (
  <ExclamationTriangleIcon color={warningColor.value} />
);

const createSchema = (deviceInfo) => {
  const schema = {
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'description',
        label: removeDescription(deviceInfo),
      },
    ],
  };

  if (deviceInfo[0].deviceGroups.length > 1) {
    schema.fields.push({
      component: 'search-input',
      name: 'name',
      label: 'Select a group',
      isRequired: true,
      validate: [{ type: validatorTypes.REQUIRED }],
    });
  }

  return schema;
};

const RemoveDeviceModal = ({
  isModalOpen,
  setIsModalOpen,
  reloadData,
  deviceInfo,
}) => {
  const dispatch = useDispatch();
  const { deviceGroups } = deviceInfo[0];

  const handleRemoveDevices = (values) => {
    const hasManyGroups = deviceGroups.length > 1;
    const groupName = hasManyGroups
      ? values.group.toString()
      : deviceGroups[0].Name;
    const groupId = hasManyGroups ? values.group.groupId : deviceGroups[0].ID;

    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${deviceInfo[0].name} has been removed from ${groupName} successfully`,
      },
      onError: {
        title: 'Error',
        description: 'Failed to remove device from group',
      },
    };

    apiWithToast(
      dispatch,
      () => removeDeviceFromGroupById(groupId, deviceInfo[0].ID),
      statusMessages
    );
  };

  return (
    <Modal
      isOpen={isModalOpen}
      variant="danger"
      openModal={() => setIsModalOpen(false)}
      title="Remove from group"
      submitLabel="Remove"
      titleIconVariant={WarningIcon}
      additionalMappers={{
        'search-input': {
          component: SearchInput,
          defaultOptions:
            deviceGroups.map((group) => ({
              DeviceGroup: group,
            })) || [],
        },
      }}
      schema={createSchema(deviceInfo)}
      onSubmit={handleRemoveDevices}
      reloadData={reloadData}
    />
  );
};

export default RemoveDeviceModal;

RemoveDeviceModal.propTypes = {
  isModalOpen: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  reloadData: PropTypes.func,
  deviceInfo: PropTypes.array,
};
