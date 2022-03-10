import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownPosition,
  Flex,
  FlexItem,
  Skeleton,
} from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import Empty from '../../components/Empty';
import { Link, useHistory } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import DeviceTable from '../Devices/DeviceTable';
import { useParams } from 'react-router-dom';
import {
  getGroupById,
  removeDeviceFromGroupById,
  removeDevicesFromGroup,
} from '../../api/index';
import DeviceModal from '../Devices/DeviceModal';
import { stateToUrlSearch } from '../../constants';
import useApi from '../../hooks/useApi';
import apiWithToast from '../../utils/apiWithToast';
import { useDispatch } from 'react-redux';

const GroupsDetail = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response, fetchData] = useApi(() => getGroupById(groupId));
  const { data, isLoading, hasError } = response;
  const { groupId } = params;

  let deviceIds = [];
  const getDeviceIds = (values) => {
    deviceIds = values;
  };

  useEffect(() => {
    history.push({
      pathname: history.location.pathname,
      search: stateToUrlSearch('add_system_modal=true', isModalOpen),
    });
  }, [isModalOpen]);

  const handleSingleDeviceRemoval = (deviceId) => {
    console.log('removed');
    console.log(groupId);
    console.log(deviceId);
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: 'Device has been removed successfully',
      },
      onError: { title: 'Error', description: 'Failed to remove device' },
    };
    apiWithToast(
      dispatch,
      () => removeDeviceFromGroupById(groupId, deviceId),
      statusMessages
    );
  };

  const handleBulkDeviceRemoval = () => {
    console.log('removed bulk');
    console.log(groupId);
    console.log(deviceIds);
    const statusMessages = {
      onSuccess: {
        title: 'Success',
        description: 'devices have been removed successfully',
      },
      onError: { title: 'Error', description: 'failed to remove devices' },
    };
    apiWithToast(
      removeDevicesFromGroup(
        parseInt(groupId),
        deviceIds.map((device) => ({ ID: device.deviceID }))
      ),
      statusMessages
    );
  };

  return (
    <>
      <PageHeader className="pf-m-light">
        {data?.Name ? (
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to={`${paths['fleet-management']}`}>Groups</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>{data.Name}</BreadcrumbItem>
          </Breadcrumb>
        ) : (
          <Breadcrumb isActive>
            <Skeleton width="100px" />
          </Breadcrumb>
        )}
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            {data?.Name ? (
              <PageHeaderTitle title={data?.Name} />
            ) : (
              <Skeleton width="150px" />
            )}
          </FlexItem>
          <FlexItem>
            <Dropdown
              position={DropdownPosition.right}
              toggle={
                <DropdownToggle
                  id="image-set-details-dropdown"
                  toggleIndicator={CaretDownIcon}
                  onToggle={(newState) => setIsDropdownOpen(newState)}
                  isDisabled={false}
                >
                  Actions
                </DropdownToggle>
              }
              isOpen={isDropdownOpen}
              dropdownItems={[
                <DropdownItem key="update-all-devices">Delete</DropdownItem>,
              ]}
            />
          </FlexItem>
        </Flex>
      </PageHeader>
      <Main className="edge-devices">
        {data?.Devices?.length > 0 ? (
          <DeviceTable
            data={data?.Devices || []}
            count={data?.Devices.length}
            isLoading={isLoading}
            hasError={hasError}
            hasCheckbox={true}
            setIsModalOpen={setIsModalOpen}
            handleSingleDeviceRemoval={handleSingleDeviceRemoval}
            kebabItems={[
              {
                title: 'Remove from group',
                onClick: handleBulkDeviceRemoval,
              },
            ]}
            selectedItems={getDeviceIds}
          />
        ) : (
          <Flex justifyContent={{ default: 'justifyContentCenter' }}>
            <Empty
              icon="cube"
              title="Add systems to the group"
              body="Create system groups to help manage your devices more effectively"
              primaryAction={{
                text: 'Add systems',
                click: () => setIsModalOpen(true),
              }}
              secondaryActions={[
                {
                  type: 'link',
                  title: 'Learn more about system groups',
                  link: '#',
                },
              ]}
            />
          </Flex>
        )}
      </Main>
      {isModalOpen && (
        <DeviceModal
          groupId={groupId}
          closeModal={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
          reloadData={fetchData}
        />
      )}
    </>
  );
};

export default GroupsDetail;
