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
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import DeviceTable from '../Devices/DeviceTable';
import { useParams } from 'react-router-dom';
import { getGroupById } from '../../api/index';
import DeviceModal from '../Devices/DeviceModal';

const GroupsDetail = () => {
  const [data, setData] = useState({});
  const [reload, setReload] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();
  const { groupId } = params;

  useEffect(() => {
    reloadData();
  }, []);

  const reloadData = async () => {
    const groupData = await getGroupById(groupId);
    setData(groupData);
  };

  return (
    <>
      <PageHeader className="pf-m-light">
        {data?.Name ? (
          <Breadcrumb>
            <BreadcrumbItem>
              <Link to={`${paths['fleet-management']}`}>Fleet Management</Link>
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
            temp={data?.Devices.map((device) => device.ID)}
            reload={reload}
            setReload={setReload}
            setIsModalOpen={setIsModalOpen}
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
      <DeviceModal
        groupId={groupId}
        closeModal={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
        reloadData={() => setReload(true)}
      />
    </>
  );
};

export default GroupsDetail;
