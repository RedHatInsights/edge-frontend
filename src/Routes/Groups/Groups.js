import React, { useEffect, useState } from 'react';
import { Button, Flex, FlexItem, Bullseye } from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import GroupTable from './GroupTable';
import Empty from '../../components/Empty';
import Modal from '../../components/Modal';
import { Link } from 'react-router-dom';
import { getGroups } from '../../api/index';

const Groups = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const groups = await getGroups();
      console.log(groups);

      //setData(groups.data);
      setData([
        {
          id: 1,
          name: 'group1',
          systems: '500',
          image: 'super golden image',
          status: '100%',
        },
      ]);
    })();
  }, []);
  return (
    <>
      <PageHeader className="pf-m-light">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <PageHeaderTitle title="Fleet management" />
          </FlexItem>
          <FlexItem>
            <Button variant="secondary">
              <Link style={{ textDecoration: 'none' }} to="/inventory">
                View entire inventory
              </Link>
            </Button>
          </FlexItem>
        </Flex>
      </PageHeader>
      <Main className="edge-devices">
        {data?.length > 0 ? (
          <GroupTable data={data} openModal={() => setIsModalOpen(true)} />
        ) : (
          <Bullseye>
            <Empty
              title="No groups yet!"
              primaryAction={{
                text: 'Create group',
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
        title="Create group"
        submitLabel="Save"
        schema={{
          fields: [
            { component: 'text-field', name: 'name', label: 'Group name' },
          ],
        }}
        onSubmit={() => console.log('submitted')}
        reloadData={() => console.log('data reloaded')}
      />
    </>
  );
};

export default Groups;
