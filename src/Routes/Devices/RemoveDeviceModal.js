import React from 'react';
import PropTypes from 'prop-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import Modal from '../../components/Modal';
import SearchInput from '../../components/SearchInput';
import apiWithToast from '../../utils/apiWithToast';
import {
  removeDeviceFromGroupById,
  removeDevicesFromInventoryGroup,
} from '../../api/groups';
import { useDispatch } from 'react-redux';
import { Text, Icon } from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import useInventoryGroups from '../../hooks/useInventoryGroups';
import { useFeatureFlags } from '../../utils';
import { FEATURE_INVENTORY_WORKSPACES_RENAME } from '../../constants/features';

const removeDescription = (deviceInfo, inventoryGroupsEnabled) => {
  const { deviceGroups } = deviceInfo[0];

  const systemText =
    deviceInfo.length > 1 ? `${deviceInfo.length} systems` : deviceInfo[0].name;
  const groupText =
    deviceGroups.length === 1
      ? deviceGroups[0].Name
      : `${deviceGroups.length} groups`;

  if (inventoryGroupsEnabled) {
    return (
      <Text>
        <strong>{systemText} </strong> will no longer be part of{' '}
        <strong>{groupText}</strong> and its configuration will be impacted.
      </Text>
    );
  }

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
  <Icon status="warning">
    <ExclamationTriangleIcon />
  </Icon>
);

const createSchema = (deviceInfo, inventoryGroupsEnabled) => {
  const schema = {
    fields: [
      {
        component: componentTypes.PLAIN_TEXT,
        name: 'description',
        label: removeDescription(deviceInfo, inventoryGroupsEnabled),
      },
    ],
  };

  if (deviceInfo[0].deviceGroups.length > 1) {
    schema.fields.push({
      component: 'search-input',
      name: 'group',
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

  const [inventoryGroupsEnabled] = useInventoryGroups(false);
  const useWorkspacesRename = useFeatureFlags(
    FEATURE_INVENTORY_WORKSPACES_RENAME
  );

  const { deviceGroups } = deviceInfo[0];

  const handleRemoveDevices = (values) => {
    const hasManyGroups = deviceGroups.length > 1;
    const groupName = hasManyGroups
      ? values.group.toString()
      : deviceGroups[0].Name;
    const groupId = hasManyGroups ? values.group.groupId : deviceGroups[0].ID;
    const systemText =
      deviceInfo.length > 1
        ? `${deviceInfo.length} systems`
        : deviceInfo[0].name;

    const errorMessageDescription = inventoryGroupsEnabled
      ? deviceInfo.length > 1
        ? `Failed to remove ${deviceInfo.length} systems from ${groupName}`
        : `Failed to remove 1 system from ${groupName}`
      : 'Failed to remove system from group';

    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: `${systemText} has been removed from ${groupName} successfully`,
      },
      onError: {
        title: 'Error',
        description: errorMessageDescription,
      },
    };

    let removeDeviceGroupFunc;
    if (inventoryGroupsEnabled) {
      removeDeviceGroupFunc = () =>
        removeDevicesFromInventoryGroup(
          groupId,
          deviceInfo.map((device) => device.UUID)
        );
    } else {
      removeDeviceGroupFunc = () =>
        removeDeviceFromGroupById(groupId, deviceInfo[0].ID);
    }

    apiWithToast(dispatch, removeDeviceGroupFunc, statusMessages);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      variant="danger"
      closeModal={() => setIsModalOpen(false)}
      title={`Remove from ${
        inventoryGroupsEnabled && useWorkspacesRename ? 'workspace' : 'group'
      }`}
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
      schema={createSchema(deviceInfo, inventoryGroupsEnabled)}
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
