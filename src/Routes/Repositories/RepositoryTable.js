import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';

const filters = [{ label: 'Name', type: 'text' }];

const RepositoryTable = ({ data, openModal }) => {
  const actionResolver = (rowData) => {
    const { id, repoName, repoBaseURL } = rowData;
    return [
      {
        title: 'Edit',
        onClick: () =>
          openModal({
            type: 'edit',
            id: id,
            name: repoName,
            baseURL: repoBaseURL,
          }),
      },
      {
        title: 'Remove',
        onClick: () =>
          openModal({
            type: 'remove',
            id: id,
            name: repoName,
            baseURL: repoBaseURL,
          }),
      },
    ];
  };

  const buildRows = data.map(({ id, name, baseURL }) => {
    return {
      id: id,
      repoName: name,
      repoBaseURL: baseURL,
      noApiSortFilter: [name, baseURL],
      cells: [
        {
          title: (
            <>
              <Text className="pf-u-mb-xs" component={TextVariants.p}>
                {name}
              </Text>
              <Text
                component={TextVariants.a}
                href={baseURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {baseURL} <ExternalLinkAltIcon className="pf-u-ml-sm" />
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
