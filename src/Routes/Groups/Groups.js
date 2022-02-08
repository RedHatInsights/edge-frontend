import React, { useEffect, useState } from 'react';
import { Skeleton, Button, Flex, FlexItem } from '@patternfly/react-core';
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
import { createGroup, updateGroupById } from '../../api/index';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { nameValidator } from '../../constants';

const Groups = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    title: 'Create group',
    onSubmit: (values) => createGroup(values),
    submitLabel: 'Create',
    initialValues: {},
  });

  const fetchGroups = async () => {
    const groups = await getGroups();
    setData(groups.data);
    setIsLoading(false);
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
      <PageHeader className="pf-m-light">
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <PageHeaderTitle title="Groups" />
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
        {isLoading ? (
          <Skeleton />
        ) : data?.length > 0 ? (
          <GroupTable
            data={data}
            isLoading={isLoading}
            handleRenameModal={handleRenameModal}
            openModal={() => setIsModalOpen(true)}
          />
        ) : (
          <Flex justifyContent={{ default: 'justifyContentCenter' }}>
            <Empty
              icon="module"
              title="Create a system group"
              body="Create system groups to help manage your devices more effectively"
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
              validate: [{ type: validatorTypes.REQUIRED }, nameValidator],
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
