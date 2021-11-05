import React from 'react';
import GeneralTable from '../../components/generalTable/GeneralTable';
import PropTypes from 'prop-types';

const filters = [
  { label: 'Name', type: 'text' },
  {
    label: 'Distribution',
    type: 'checkbox',
    options: [{ option: '8.4' }, { option: '8.3' }],
  },
  {
    label: 'Status',
    type: 'checkbox',
    options: [{ option: 'BUILDING' }, { option: 'CREATED' }],
  },
];

const RepositoryTable = ({ data, openModal }) => {
  return (
    <GeneralTable
      filters={filters}
      data={data}
      actionFunction={openModal}
      toolbarButtons={[
        {
          title: 'Add repository',
          click: () => openModal({ type: 'add' }),
        },
      ]}
    />
  );
};
RepositoryTable.propTypes = {
  filters: PropTypes.func,
  data: PropTypes.array,
  toolbarButtons: PropTypes.array,
  openModal: PropTypes.func,
};

export default RepositoryTable;
