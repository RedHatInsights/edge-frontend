import React, { useEffect, useState } from 'react';
import { Flex } from '@patternfly/react-core';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import GroupTable from './GroupTable';
import Empty from '../../components/Empty';
import { getGroups } from '../../api/groups';
import CreateGroupModal from './CreateGroupModal';
import RenameGroupModal from './RenameGroupModal';
import DeleteGroupModal from './DeleteGroupModal';
import useApi from '../../hooks/useApi';
import { emptyStateNoFilters, useFeatureFlags } from '../../utils';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import GroupsLinkAccess from './GroupsLinkAccess';
import useInventoryGroups from '../../hooks/useInventoryGroups';
// eslint-disable-next-line react/prop-types
const Groups = ({ locationProp, navigateProp, paramsProp }) => {
  const hideCreateGroupsEnabled = useFeatureFlags(
    'edge-management.hide-create-group'
  );
  const inventoryGroupsEnabled = useInventoryGroups(false);
  const { search } = locationProp ? locationProp() : useLocation();

  const [response, fetchGroups] = useApi({
    api: getGroups,
    tableReload: true,
  });
  const chrome = useChrome();
  const { data, isLoading, hasError } = response;

  const [modalState, setModalState] = useState({ id: null, name: '' });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);

  const handleRenameModal = (id, name) => {
    setModalState({ id, name });
    setIsRenameModalOpen(true);
  };

  const handleDeleteModal = (id, name) => {
    setModalState({ id, name });
    setIsDeleteModalOpen(true);
  };

  const reloadData = async () => {
    await fetchGroups();
    setHasModalSubmitted(true);
  };

  useEffect(() => {
    chrome?.updateDocumentTitle?.('Groups - Inventory | Edge management');
  }, [chrome]);

  return (
    <>
    { inventoryGroupsEnabled ? (
      < GroupsLinkAccess />
    ) : (
    <>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Groups" />
      </PageHeader>
      <section className="edge-groups pf-l-page__main-section pf-c-page__main-section">
        {!emptyStateNoFilters(isLoading, data?.count, search) ? (
          <GroupTable
            data={data?.data || []}
            count={data?.count}
            isLoading={isLoading}
            hasError={hasError}
            handleRenameModal={handleRenameModal}
            locationProp={locationProp}
            navigateProp={navigateProp}
            paramsProp={paramsProp}
            handleDeleteModal={handleDeleteModal}
            handleCreateModal={() => setIsCreateModalOpen(true)}
            hasModalSubmitted={hasModalSubmitted}
            setHasModalSubmitted={setHasModalSubmitted}
            fetchGroups={fetchGroups}
          />
        ) : (
          <Flex justifyContent={{ default: 'justifyContentCenter' }}>
            {hideCreateGroupsEnabled}?{}:
            <Empty
              icon="plus"
              title="Create a system group"
              body="Create system groups to help manage your systems more effectively."
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
            {}
          </Flex>
        )}
      </section>

          {isCreateModalOpen && (
            <CreateGroupModal
              isModalOpen={isCreateModalOpen}
              setIsModalOpen={setIsCreateModalOpen}
              reloadData={reloadData}
            />
          )}
          {isRenameModalOpen && (
            <RenameGroupModal
              isModalOpen={isRenameModalOpen}
              setIsModalOpen={setIsRenameModalOpen}
              reloadData={reloadData}
              modalState={modalState}
            />
          )}
          {isDeleteModalOpen && (
            <DeleteGroupModal
              isModalOpen={isDeleteModalOpen}
              setIsModalOpen={setIsDeleteModalOpen}
              reloadData={reloadData}
              modalState={modalState}
            />
          )}
        </>
      )}
    </>
  
  );
};

Groups.propTypes = {
  pathPrefix: PropTypes.string,
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
  notificationProp: PropTypes.object,
  paramsProp: PropTypes.func,
};

export default Groups;
