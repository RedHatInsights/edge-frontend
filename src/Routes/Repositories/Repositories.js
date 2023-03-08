import React, { useState } from 'react';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import RemoveModal from './modals/RemoveModal';
import RepositoryTable from './RepositoryTable';
import RepositoryHeader from './RepositoryHeader';
import useApi from '../../hooks/useApi';
import { getCustomRepositories } from '../../api/repositories';
import { useLocation } from 'react-router-dom';
import { emptyStateNoFilters } from '../../utils';
import EmptyState from '../../components/Empty';
import RepositoryLinkAccess from './RepositoryLinkAccess';
import { useFeatureFlags } from '../../utils';

const Repository = () => {
  const customReposFleatureFlag = useFeatureFlags(
    'edge-management.custom_repos_ui'
  );

  const { search } = useLocation();
  const [response, fetchRepos] = useApi({
    api: ({ query }) =>
      getCustomRepositories({
        imageID: '',
        query,
      }),
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;
  const [modalDetails, setModalDetails] = useState({
    isOpen: {
      add: false,
      edit: false,
      remove: false,
    },
    id: null,
    name: '',
    baseURL: '',
  });
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);

  const closeModal = ({ type, id = null, name = '', baseURL = '' }) => {
    setModalDetails((prevState) => ({
      ...prevState,
      id,
      name,
      baseURL,
      isOpen: {
        ...prevState.isOpen,
        [type]: !prevState.isOpen[type],
      },
    }));
  };

  const reloadData = async () => {
    await fetchRepos();
    setHasModalSubmitted(true);
  };

  return (
    <>
      {customReposFleatureFlag ? (
        <RepositoryLinkAccess />
      ) : (
        <>
          <RepositoryHeader />
          <section className="pf-l-page__main-section pf-c-page__main-section">
            <>
              {!emptyStateNoFilters(isLoading, data?.count, search) ? (
                <RepositoryTable
                  data={data?.data || []}
                  count={data?.count}
                  closeModal={closeModal}
                  isLoading={isLoading}
                  hasError={hasError}
                  fetchRepos={fetchRepos}
                  hasModalSubmitted={hasModalSubmitted}
                  setHasModalSubmitted={setHasModalSubmitted}
                />
              ) : (
                <EmptyState
                  icon="repository"
                  title="Add a custom repository"
                  body="Add custom repositories to build RHEL for Edge images with additional packages."
                  primaryAction={{
                    text: 'Add repository',
                    click: () => closeModal({ type: 'add' }),
                  }}
                />
              )}
            </>
            <AddModal
              isOpen={modalDetails.isOpen.add}
              closeModal={closeModal}
              reloadData={reloadData}
            />
            <EditModal
              isOpen={modalDetails.isOpen.edit}
              id={modalDetails.id}
              name={modalDetails.name}
              baseURL={modalDetails.baseURL}
              closeModal={closeModal}
              reloadData={reloadData}
            />
            <RemoveModal
              isOpen={modalDetails.isOpen.remove}
              id={modalDetails.id}
              name={modalDetails.name}
              baseURL={modalDetails.baseURL}
              closeModal={closeModal}
              reloadData={reloadData}
            />
          </section>
        </>
      )}
    </>
  );
};

export default Repository;
