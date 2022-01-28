import React, { useState } from 'react';
import { Button, Flex, FlexItem, Bullseye } from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import GroupTable from './GroupTable';
import Empty from '../../components/Empty';
import Modal from '../../components/Modal';

const Groups = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([
    {
      id: 1,
      name: 'group1',
      systems: '500',
      image: 'super golden image',
      status: '100%',
    },
    {
      id: 2,
      name: 'group2',
      systems: '1k',
      image: 'golden image',
      status: '50%',
    },
  ]);

  return (
    <>
      <PageHeader className="pf-m-light">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <PageHeaderTitle title="Fleet management" />
          </FlexItem>
          <FlexItem>
            <Button variant="secondary">View entire inventory</Button>
          </FlexItem>
        </Flex>
      </PageHeader>
      <Main className="edge-devices">
        {true ? (
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
