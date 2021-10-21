import React, { useEffect, useState } from 'react';
import EmptyState from './Empty';
import AddModal from './modals/AddModal';
import EditModal from './modals/EditModal';
import RemoveModal from './modals/RemoveModal';
import TableHeader from './TableHeader';
import GeneralTable from './GeneralTable';
import Main from '@redhat-cloud-services/frontend-components/Main';
import RepositoryHeader from './RepositoryHeader';
import { getCustomRepositories } from '../../api/index';

const Repository = () => {
    const [data, setData] = useState([]);

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

    const toggle = ({ type, id = null, name = '', baseURL = '' }) => {
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

    useEffect(async () => {
        const repos = await getCustomRepositories();
        setData(
            repos.data.map((repo) => ({
                id: repo.ID,
                name: repo.Name,
                baseURL: repo.URL,
                ...repo,
            }))
        );
    }, []);
    console.log(data);

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
                            toggle={toggle}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon='repository'
                        title='Add a third-party repository'
                        body='Add third-party repositories to build RHEL for Edge images with additional packages.'
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
                <AddModal
                    isOpen={modalDetails.isOpen.add}
                    toggle={toggle}
                    setData={setData}
                />
                <EditModal
                    isOpen={modalDetails.isOpen.edit}
                    id={modalDetails.id}
                    name={modalDetails.name}
                    baseURL={modalDetails.baseURL}
                    toggle={toggle}
                    setData={setData}
                />
                <RemoveModal
                    isOpen={modalDetails.isOpen.remove}
                    id={modalDetails.id}
                    name={modalDetails.name}
                    baseURL={modalDetails.baseURL}
                    toggle={toggle}
                    setData={setData}
                />
            </Main>
        </>
    );
};

export default Repository;
