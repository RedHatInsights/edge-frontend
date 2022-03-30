import React, { useEffect, useState } from 'react';
import { Skeleton, Flex } from '@patternfly/react-core';
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

// LEFT OFF ON SPLITTING GROUP MODALS

const Groups = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({ id: null, name: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const fetchGroups = async () => {
    const groups = await getGroups();
    setData(groups.data);
    setIsLoading(false);
  };

  const handleRenameModal = (id, name) => {
    setModalState({ id, name });
    setIsRenameModalOpen(true);
  };

  const handleDeleteModal = (id, name) => {
    setModalState({ id, name });
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Groups" />
      </PageHeader>
      <Main className="edge-devices">
        {isLoading ? (
          <Skeleton />
        ) : data?.length > 0 ? (
          <GroupTable
            data={data}
            isLoading={isLoading}
            handleRenameModal={handleRenameModal}
            handleDeleteModal={handleDeleteModal}
            handleCreateModal={() => setIsCreateModalOpen(true)}
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
