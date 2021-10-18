import React, { useState } from 'react';
import ToolbarHeader from './ToolbarHeader';
import Table from './Table';

const GeneralTable = ({ data, toolbarButtons, actions }) => {
  const [repos] = useState(data);
  const [input, setInput] = useState('');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const filteredByName = () =>
    repos.filter((repo) =>
      repo.name.toLowerCase().includes(input.toLowerCase())
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
        actions={actions}
        columns={['Name']}
        rows={filteredByName().slice(
          (page - 1) * perPage,
          (page - 1) * perPage + perPage
        )}
      />
    </>
  );
};

export default GeneralTable;
