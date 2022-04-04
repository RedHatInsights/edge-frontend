import React, { useState } from 'react';
import { Flex } from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import GroupTable from './GroupTable';
import Empty from '../../components/Empty';
import { getGroups } from '../../api/index';
import CreateGroupModal from './CreateGroupModal';
import RenameGroupModal from './RenameGroupModal';
import DeleteGroupModal from './DeleteGroupModal';
import useApi from '../../hooks/useApi';

const Groups = () => {
  const [response, fetchData] = useApi(getGroups);
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
        {isLoading || data?.count > 0 ? (
          <GroupTable
            data={data?.data || []}
            count={data?.count}
            isLoading={isLoading}
            hasError={hasError}
            handleRenameModal={handleRenameModal}
            handleDeleteModal={handleDeleteModal}
            handleCreateModal={() => setIsCreateModalOpen(true)}
            openModal={handleCreateModal}
            getGroups={getGroups}
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
                  link: '#',
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
          reloadData={fetchData}
        />
      )}
      {isRenameModalOpen && (
        <RenameGroupModal
          isModalOpen={isRenameModalOpen}
          setIsModalOpen={setIsRenameModalOpen}
          reloadData={fetchData}
          modalState={modalState}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteGroupModal
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          reloadData={fetchData}
          modalState={modalState}
        />
      )}
    </>
  );
};

export default Groups;
