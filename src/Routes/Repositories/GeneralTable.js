import React, { useState } from 'react';
import ToolbarHeader from './ToolbarHeader';
import ToolbarFooter from './ToolbarFooter';
import Table from './Table';

const GeneralTable = ({ data, toolbarButtons, toggle }) => {
    const [input, setInput] = useState('');
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const filteredByName = () =>
        data.filter((repo) =>
            repo.Name.toLowerCase().includes(input.toLowerCase())
        );
    return (
        <>
            <ToolbarHeader
                count={data.length}
                toolbarButtons={toolbarButtons}
                setInput={setInput}
                perPage={perPage}
                setPerPage={setPerPage}
                page={page}
                setPage={setPage}
            />
            <Table
                toggle={toggle}
                columns={['Name']}
                rows={filteredByName().slice(
                    (page - 1) * perPage,
                    (page - 1) * perPage + perPage
                )}
            />
            <ToolbarFooter
                count={data.length}
                setInput={setInput}
                perPage={perPage}
                setPerPage={setPerPage}
                page={page}
                setPage={setPage}
            />
        </>
    );
};

export default GeneralTable;
