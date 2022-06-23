import React, { useState } from 'react';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import RemoveModal from './modals/RemoveModal';
import TableHeader from './TableHeader';
import RepositoryTable from './RepositoryTable';
import Main from '@redhat-cloud-services/frontend-components/Main';
import RepositoryHeader from './RepositoryHeader';
import useApi from '../../hooks/useApi';
import { getCustomRepositories } from '../../api/repositories';
import { useHistory } from 'react-router-dom';
import { emptyStateNoFliters } from '../../utils';
import { routes as paths } from '../../constants/routeMapper';
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

  const openModal = ({ type, id = null, name = '', baseURL = '' }) => {
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

  return (
    <>
      <RepositoryHeader />
      <Main>
        <>
          <TableHeader />
          {!emptyStateNoFliters(isLoading, data?.count, history) ? (
            <RepositoryTable
              data={data?.data || []}
              count={data?.count}
              openModal={openModal}
              isLoading={isLoading}
              hasError={hasError}
              fetchRepos={fetchRepos}
            />
          ) : (
            <EmptyState
              icon="repository"
              title="No custom repositories available"
              body="Add custom repositories to build RHEL for Edge images with additional packages."
              primaryAction={{
                text: 'Custom repositories',
                href: paths['repositories'],
              }}
            />
          )}
        </>
        <AddModal
          isOpen={modalDetails.isOpen.add}
          openModal={openModal}
          reloadData={fetchRepos}
        />
        <EditModal
          isOpen={modalDetails.isOpen.edit}
          id={modalDetails.id}
          name={modalDetails.name}
          baseURL={modalDetails.baseURL}
          openModal={openModal}
          reloadData={fetchRepos}
        />
        <RemoveModal
          isOpen={modalDetails.isOpen.remove}
          id={modalDetails.id}
          name={modalDetails.name}
          baseURL={modalDetails.baseURL}
          openModal={openModal}
          reloadData={fetchRepos}
        />
      </Main>
    </>
  );
};

export default Repository;
