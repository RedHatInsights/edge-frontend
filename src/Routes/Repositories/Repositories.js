import React, { useState } from 'react';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import RemoveModal from './modals/RemoveModal';
import RepositoryTable from './RepositoryTable';
import Main from '@redhat-cloud-services/frontend-components/Main';
import RepositoryHeader from './RepositoryHeader';
import useApi from '../../hooks/useApi';
import { getCustomRepositories } from '../../api/repositories';
import { useHistory } from 'react-router-dom';
import { emptyStateNoFliters } from '../../utils';
import EmptyState from '../../components/Empty';

const Repository = () => {
  const history = useHistory();
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

  const reloadData = () => {
    fetchRepos();
    setTimeout(() => setHasModalSubmitted(true), 800);
  };

  return (
    <>
      <RepositoryHeader />
      <Main>
        <>
          {!emptyStateNoFliters(isLoading, data?.count, history) ? (
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
      </Main>
    </>
  );
};

export default Repository;
