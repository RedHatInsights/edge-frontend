import React, { useEffect, useState } from 'react';
import EmptyState from '../../components/Empty';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import RemoveModal from './modals/RemoveModal';
import TableHeader from './TableHeader';
import RepositoryTable from './RepositoryTable';
import Main from '@redhat-cloud-services/frontend-components/Main';
import RepositoryHeader from './RepositoryHeader';
import { getCustomRepositories } from '../../api/repositories';
import { Skeleton } from '@patternfly/react-core';

const Repository = () => {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
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

  const reloadData = async () => {
    const repos = await getCustomRepositories('');
    setData(
      repos.data.map((repo) => ({
        id: repo.ID,
        name: repo.Name,
        baseURL: repo.URL,
        ...repo,
      }))
    );
    setLoaded(true);
  };

  useEffect(() => reloadData(), []);

  return (
    <>
      <RepositoryHeader />
      <Main>
        {loaded ? (
          data.length > 0 ? (
            <>
              <TableHeader />
              <RepositoryTable data={data} openModal={openModal} />
            </>
          ) : (
            <EmptyState
              icon="repository"
              title="Add a custom repository"
              body="Add custom repositories to build RHEL for Edge images with additional packages."
              primaryAction={{
                text: 'Add repository',
                click: () => openModal({ type: 'add' }),
              }}
              secondaryActions={
                [
                  //{
                  //  title: 'Learn more about custom repositories',
                  //  type: 'link',
                  //  link: '#',
                  //},
                ]
              }
            />
          )
        ) : (
          <Skeleton />
        )}
        <AddModal
          isOpen={modalDetails.isOpen.add}
          openModal={openModal}
          reloadData={reloadData}
        />
        <EditModal
          isOpen={modalDetails.isOpen.edit}
          id={modalDetails.id}
          name={modalDetails.name}
          baseURL={modalDetails.baseURL}
          openModal={openModal}
          reloadData={reloadData}
        />
        <RemoveModal
          isOpen={modalDetails.isOpen.remove}
          id={modalDetails.id}
          name={modalDetails.name}
          baseURL={modalDetails.baseURL}
          openModal={openModal}
          reloadData={reloadData}
        />
      </Main>
    </>
  );
};

export default Repository;
