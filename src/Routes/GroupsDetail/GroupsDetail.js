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
  Bullseye,
} from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import Empty from '../../components/Empty';
import Modal from '../../components/Modal';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import DeviceTable from '../Devices/DeviceTable';
import { useParams } from 'react-router-dom';
import { getGroupById } from '../../api/index';

const GroupsDetail = () => {
  const [data, setData] = useState({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const params = useParams();

  useEffect(() => {
    (async () => {
      const { groupId } = params;
      console.log(groupId);
      const groupData = await getGroupById(groupId);
      setData(groupData.data);
    })();
  }, []);

  return (
    <>
      <PageHeader className="pf-m-light">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={`${paths['fleet-management']}`}>Fleet Management</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>Group 1</BreadcrumbItem>
        </Breadcrumb>
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <PageHeaderTitle title="Group 1" />
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
                <DropdownItem key="update-all-devices">
                  Update all devices
                </DropdownItem>,
              ]}
            />
          </FlexItem>
        </Flex>
      </PageHeader>
      <Main className="edge-devices">
        {data?.devices?.length > 0 ? (
          <DeviceTable />
        ) : (
          <Bullseye>
            <Empty
              title="No systems in group yet!"
              primaryAction={{
                text: 'Add some systems',
                click: () => setIsModalOpen(true),
              }}
              secondaryActions={[]}
            />
          </Bullseye>
        )}
      </Main>

      <Modal
        isOpen={isModalOpen}
        openModal={() => setIsModalOpen(false)}
        title="Add systems"
        submitLabel="Add selected"
        additionalMappers={{
          'device-table': { component: DeviceTable, skeletonRowQuantity: 15 },
        }}
        schema={{
          fields: [{ component: 'device-table', name: 'device-table' }],
        }}
        onSubmit={() => console.log('submitted')}
        reloadData={() => console.log('data reloaded')}
        size="large"
      />
    </>
  );
};

export default GroupsDetail;
