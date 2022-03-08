import React, { useEffect, useState } from 'react';
import { Skeleton, Flex } from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import GroupTable from './GroupTable';
import Empty from '../../components/Empty';
import Modal from '../../components/Modal';
import { getGroups } from '../../api/index';
import { createGroup, updateGroupById } from '../../api/index';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { nameValidator } from '../../constants';
const createModalState = {
  title: 'Create group',
  onSubmit: (values) => createGroup(values),
  submitLabel: 'Create',
  initialValues: {},
};

const Groups = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState(createModalState);

  const fetchGroups = async () => {
    const groups = await getGroups();
    setData(groups.data);
    setIsLoading(false);
  };

  const handleCreateModal = () => {
    setModalState(createModalState);
    setIsModalOpen(true);
  };

  const handleRenameModal = (id, initialValues) => {
    setModalState({
      title: 'Rename group',
      onSubmit: (values) => updateGroupById(id, values),
      submitLabel: 'Save',
      initialValues,
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <PageHeader className='pf-m-light'>
        <PageHeaderTitle title='Groups' />
      </PageHeader>
      <Main className='edge-devices'>
        {isLoading ? (
          <Skeleton />
        ) : data?.length > 0 ? (
          <GroupTable
            data={data}
            isLoading={isLoading}
            handleRenameModal={handleRenameModal}
            openModal={handleCreateModal}
          />
        ) : (
          <Flex justifyContent={{ default: 'justifyContentCenter' }}>
            <Empty
              icon='module'
              title='Create a system group'
              body='Create system groups to help manage your devices more effectively'
              primaryAction={{
                text: 'Create group',
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

      <Modal
        isOpen={isModalOpen}
        openModal={() => setIsModalOpen(false)}
        title={modalState.title}
        submitLabel={modalState.submitLabel}
        schema={{
          fields: [
            {
              component: 'text-field',
              name: 'name',
              label: 'Group name',
              helperText:
                'Can only contain letters, numbers, spaces, hyphens ( - ), and underscores( _ ).',
              isRequired: true,
              validate: [
                { type: validatorTypes.REQUIRED },

                { type: validatorTypes.MAX_LENGTH, threshold: 50 },
                nameValidator,
              ],
            },
          ],
        }}
        initialValues={modalState.initialValues}
        onSubmit={modalState.onSubmit}
        reloadData={() => fetchGroups()}
      />
    </>
  );
};

export default Groups;
