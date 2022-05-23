import React, { useState } from 'react';
import { Flex } from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import GroupTable from './GroupTable';
import Empty from '../../components/Empty';
import { getGroups } from '../../api/groups';
import CreateGroupModal from './CreateGroupModal';
import RenameGroupModal from './RenameGroupModal';
import DeleteGroupModal from './DeleteGroupModal';
import useApi from '../../hooks/useApi';
import { useHistory } from 'react-router-dom';
import { emptyStateNoFliters } from '../../constants';

const Groups = () => {
  const history = useHistory();
  const [response, fetchGroups] = useApi({
    api: getGroups,
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;

  const [modalState, setModalState] = useState({ id: null, name: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleRenameModal = (id, name) => {
    setModalState({ id, name });
    setIsRenameModalOpen(true);
  };

  const handleDeleteModal = (id, name) => {
    setModalState({ id, name });
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Groups" />
      </PageHeader>
      <Main className="edge-devices">
        {!emptyStateNoFliters(isLoading, data?.count, history) ? (
          <GroupTable
            data={data?.data || []}
            count={data?.count}
            isLoading={isLoading}
            hasError={hasError}
            handleRenameModal={handleRenameModal}
            handleDeleteModal={handleDeleteModal}
            handleCreateModal={() => setIsCreateModalOpen(true)}
            fetchGroups={fetchGroups}
          />
        ) : (
          <Flex justifyContent={{ default: 'justifyContentCenter' }}>
            <Empty
              icon="module"
              title="Create a system group"
              body="Create system groups to help manage your devices more effectively"
              primaryAction={{
                text: 'Create group',
                click: () => setIsCreateModalOpen(true),
              }}
              secondaryActions={[
                {
                  type: 'link',
                  title: 'Learn more about system groups',
                  link: 'https://access.redhat.com/documentation/en-us/edge_management/2022/html-single/working_with_systems_in_the_edge_management_application/index',
                },
              ]}
            />
          </Flex>
        )}
      </Main>

      {isCreateModalOpen && (
        <CreateGroupModal
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
          reloadData={fetchGroups}
        />
      )}
      {isRenameModalOpen && (
        <RenameGroupModal
          isModalOpen={isRenameModalOpen}
          setIsModalOpen={setIsRenameModalOpen}
          reloadData={fetchGroups}
          modalState={modalState}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteGroupModal
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          reloadData={fetchGroups}
          modalState={modalState}
        />
      )}
    </>
  );
};

export default Groups;
