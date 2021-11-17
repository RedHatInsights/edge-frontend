import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const filters = [{ label: 'Name', type: 'text' }];

const RepositoryTable = ({ data, openModal }) => {
  const actionResolver = (rowData) => {
    return [
      {
        title: 'Edit',
        onClick: () =>
          openModal({
            type: 'edit',
            id: rowData.id,
            name: rowData.rowName,
            baseURL: rowData.baseURL,
          }),
      },
      {
        title: 'Remove',
        onClick: () =>
          openModal({
            type: 'remove',
            id: rowData.id,
            name: rowData.rowName,
            baseURL: rowData.baseURL,
          }),
      },
    ];
  };

  const buildRows = data.map(({ id, name, baseURL }) => {
    return {
      id: id,
      rowName: name,
      baseURL: baseURL,
      cells: [
        {
          title: (
            <>
              <Text classname="pf-u-mb-xs" component={TextVariants.p}>
                {name}
              </Text>
              <Text component={TextVariants.a}>
                <a href={baseURL} target="_blank" rel="noopener noreferrer">
                  {baseURL} <ExternalLinkAltIcon classname="pf-u-ml-sm" />
                </a>
              </Text>
            </>
          ),
        },
      ],
    };
  });

  return (
    <GeneralTable
      apiFilterSort={false}
      filters={filters}
      tableData={{
        count: data.length,
        data,
        isLoading: false,
        hasError: false,
      }}
      columnNames={[{ title: 'Name', type: 'name', sort: true }]}
      rows={buildRows}
      actionResolver={actionResolver}
      areActionsDisabled={() => false}
      defaultSort={{ index: 0, direction: 'desc' }}
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
  data: PropTypes.array,
  openModal: PropTypes.func,
};

export default RepositoryTable;
