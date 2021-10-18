import React, { useState } from 'react';
import EmptyState from './Empty';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import RemoveModal from './modals/RemoveModal';
import TableHeader from './TableHeader';
import GeneralTable from './GeneralTable';
import Main from '@redhat-cloud-services/frontend-components/Main';
import RepositoryHeader from './RepositoryHeader';

const Repository = () => {
  //const repos = [];
  const data = [
    {
      name: 'Friendly 3rd Part Repo Name',
      baseURL:
        'https://cdn/redhat.com/content/dist/layered/rhel8/x86_64/rhocp/4.4./os',
    },
    {
      name: 'something',
      baseURL:
        'https://cdn/redhat.com/content/dist/layered/rhel8/x86_64/rhocp/4.4./os',
    },
  ];

  const [modalDetails, setModalDetails] = useState({
    isOpen: {
      add: false,
      edit: false,
      remove: false,
    },
    name: '',
    baseURL: '',
  });

  const toggle = ({ type, name = '', baseURL = '' }) => {
    setModalDetails((prevState) => ({
      ...prevState,
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
        {data.length > 0 ? (
          <>
            <TableHeader />
            <GeneralTable
              data={data}
              columns={['Name']}
              toolbarButtons={[
                {
                  title: 'Add repository',
                  click: () => toggle({ type: 'add' }),
                },
              ]}
              actions={{
                items: [
                  {
                    title: 'Edit',
                    onClick: () =>
                      toggle({
                        type: 'edit',
                        name,
                        baseURL,
                      }),
                  },
                  {
                    title: 'Remove',
                    onClick: () =>
                      toggle({
                        type: 'remove',
                        name,
                        baseURL,
                      }),
                  },
                ],
              }}
            />
          </>
        ) : (
          <EmptyState
            icon="repository"
            title="Add a third-party repository"
            body="Add third-party repositories to build RHEL for Edge images with additional packages."
            primaryAction={{
              text: 'Add Repository',
              click: () => toggle({ type: 'add' }),
            }}
            secondaryActions={[
              {
                title: 'Learn more about third-party repositories',
                link: '#',
              },
            ]}
          />
        )}
        <AddModal isOpen={modalDetails.isOpen.add} toggle={toggle} />
        <EditModal
          isOpen={modalDetails.isOpen.edit}
          name={modalDetails.name}
          baseURL={modalDetails.baseURL}
          toggle={toggle}
        />
        <RemoveModal
          isOpen={modalDetails.isOpen.remove}
          name={modalDetails.name}
          baseURL={modalDetails.baseURL}
          toggle={toggle}
        />
      </Main>
    </>
  );
};

export default Repository;
