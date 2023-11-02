import React, { useEffect, useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import DeviceTable from './DeviceTable';
import RemoveDeviceModal from './RemoveDeviceModal';
import useApi from '../../hooks/useApi';
import { getInventoryByGroup } from '../../api/devices';
import { useHistory, useLocation } from 'react-router-dom';
import { Bullseye, Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useFeatureFlags } from '../../utils';
import {
  FEATURE_HIDE_GROUP_ACTIONS,
  FEATURE_PARITY_INVENTORY_GROUPS,
} from '../../constants/features';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "UpdateDeviceModal" */ './UpdateDeviceModal')
);

const DevicesGroupDetail = ({
  historyProp,
  navigateProp,
  locationProp,
  showHeaderProp,
  notificationProp,
  urlName,
  groupUUID,
}) => {
  const chrome = useChrome();
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const { pathname } = locationProp
    ? locationProp()
    : useLocation
    ? useLocation()
    : null;
  const [response, fetchDevices] = useApi({
    api: getInventoryByGroup,
    id: groupUUID,
    tableReload: true,
  });
  const showHeader = showHeaderProp === undefined ? true : showHeaderProp;
  const { data, isLoading, hasError } = response;
  const [isRemoveDeviceModalOpen, setIsRemoveDeviceModalOpen] = useState(false);
  const [deviceId, setDeviceId] = useState([]);
  const [checkedDeviceIds, setCheckedDeviceIds] = useState([]);
  const [isRowSelected, setIsRowSelected] = useState(false);
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);

  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });

  const inventoryGroupsEnabled = useFeatureFlags(
    FEATURE_PARITY_INVENTORY_GROUPS
  );

  const handleRemoveDevicesFromGroup = (ids, isRow) => {
    setIsRemoveDeviceModalOpen(true);
    isRow ? setDeviceId(ids) : setCheckedDeviceIds(ids);
    setIsRowSelected(isRow);
  };

  const canBeUpdated = () => {
    let canBeUpdated = false;
    if (checkedDeviceIds.length > 0) {
      let initialImage = checkedDeviceIds[0].imageSetId;
      for (let device of checkedDeviceIds) {
        if (device.imageSetId !== initialImage) {
          canBeUpdated = false;
          break;
        }
        if (
          (!canBeUpdated &&
            device.updateImageData &&
            device.deviceStatus === 'updateAvailable') ||
          device.deviceStatus === 'unresponsive' ||
          device.deviceStatus === 'error'
        ) {
          canBeUpdated = true;
        }
      }
    }
    return canBeUpdated;
  };

  const handleUpdateSelected = () => {
    setUpdateModal((prevState) => ({
      ...prevState,
      deviceData: checkedDeviceIds.map((device) => ({
        id: device.id,
        display_name: device.display_name,
        deviceStatus: device.deviceStatus,
      })),
      imageData: { imageName: checkedDeviceIds[0].imageName },
      imageSetId: checkedDeviceIds[0].imageSetId,
      isOpen: true,
    }));
  };

  const reloadData = async () => {
    await fetchDevices();
    setHasModalSubmitted(true);
  };
  let classNameMain = '';
  if (showHeaderProp !== undefined && showHeader) {
    classNameMain =
      'edge-devices pf-l-page__main-section pf-c-page__main-section';
  } else if (!showHeader) {
    classNameMain = 'pf-c-toolbar';
  }

  useEffect(() => {
    chrome?.updateDocumentTitle?.('Systems - Inventory | Edge management');
  }, [chrome]);

  const hideGroupsActions = useFeatureFlags(FEATURE_HIDE_GROUP_ACTIONS);
  const kebabMenuItems = [];
  if (!hideGroupsActions) {
    const groupsKebabMenuItems = [];

    if (inventoryGroupsEnabled) {
      groupsKebabMenuItems.push({
        isDisabled:
          !(checkedDeviceIds.length > 0) || // disable if no system checked
          checkedDeviceIds.filter(
            // disable if any checked systems has no groups assigned
            (device) =>
              device.deviceGroups === undefined ||
              device.deviceGroups.length === 0
          ).length > 0 ||
          checkedDeviceIds.reduce((acc, device) => {
            // disable if the checked systems has different groups assigned
            const groupIDS = device.deviceGroups
              ? device.deviceGroups.map((group) => group.ID)
              : [];
            const newGroupIDS = groupIDS.filter(
              (groupID) => !acc.includes(groupID)
            );
            acc.push(...newGroupIDS);
            return acc;
          }, []).length !== 1,
        title: 'Remove from group',
        onClick: () =>
          handleRemoveDevicesFromGroup(
            checkedDeviceIds.map((device) => ({
              ID: device.deviceID,
              name: device.display_name,
              UUID: device.id,
              deviceGroups: device.deviceGroups,
            })),
            false
          ),
      });
    }
    kebabMenuItems.push(...groupsKebabMenuItems);
  }

  return (
    <>
      {showHeader && (
        <PageHeader className="pf-m-light">
          <PageHeaderTitle title="Systems" />
        </PageHeader>
      )}
      {showHeader}
      <section className={classNameMain}>
        <DeviceTable
          historyProp={historyProp}
          navigateProp={navigateProp}
          locationProp={locationProp}
          isSystemsView={true}
          data={data?.data?.devices}
          count={data?.count}
          isLoading={isLoading}
          hasError={hasError}
          setUpdateModal={setUpdateModal}
          updateModal={updateModal}
          handleRemoveDevicesFromGroup={handleRemoveDevicesFromGroup}
          handleUpdateSelected={handleUpdateSelected}
          hasCheckbox={true}
          selectedItems={setCheckedDeviceIds}
          selectedItemsUpdateable={canBeUpdated()}
          kebabItems={kebabMenuItems.length > 0 ? kebabMenuItems : undefined}
          hasModalSubmitted={hasModalSubmitted}
          setHasModalSubmitted={setHasModalSubmitted}
          fetchDevices={fetchDevices}
          urlName={urlName}
        />
      </section>
      {updateModal.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateDeviceModal
            navigateBack={() => {
              history.push({ pathname });
              setUpdateModal((prevState) => {
                console.log('Click modal');
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
            notificationProp={notificationProp}
            refreshTable={reloadData}
          />
        </Suspense>
      )}
      {isRemoveDeviceModalOpen && (
        <RemoveDeviceModal
          isModalOpen={isRemoveDeviceModalOpen}
          setIsModalOpen={setIsRemoveDeviceModalOpen}
          reloadData={reloadData}
          deviceInfo={isRowSelected ? deviceId : checkedDeviceIds}
        />
      )}
    </>
  );
};

DevicesGroupDetail.propTypes = {
  historyProp: PropTypes.func,
  navigateProp: PropTypes.func,
  locationProp: PropTypes.func,
  showHeaderProp: PropTypes.bool,
  notificationProp: PropTypes.object,
  urlName: PropTypes.string,
  groupUUID: PropTypes.string,
};

export default DevicesGroupDetail;
