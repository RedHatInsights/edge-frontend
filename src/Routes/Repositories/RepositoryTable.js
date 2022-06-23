import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants, Tooltip } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { truncateString } from '../../utils';

const filters = [{ label: 'Name', type: 'text' }];

const RepositoryTable = ({
  data,
  count,
  isLoading,
  hasError,
  fetchRepos,
  openModal,
}) => {
  const actionResolver = (rowData) => {
    if (!rowData.rowInfo) {
      return [];
    }
    const { id, repoName, repoBaseURL } = rowData.rowInfo;
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

  const buildRows = data.map(({ ID, Name, URL }) => {
    return {
      rowInfo: {
        id: ID,
        repoName: Name,
        repoBaseURL: URL,
      },
      cells: [
        {
          title: (
            <>
              <Text className="pf-u-mb-xs" component={TextVariants.p}>
                <Tooltip content={<div>{Name}</div>}>
                  <span>{truncateString(Name, 20)}</span>
                </Tooltip>
              </Text>
              <Text
                component={TextVariants.a}
                href={URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {URL} <ExternalLinkAltIcon className="pf-u-ml-sm" />
              </Text>
            </>
          ),
        },
      ],
    };
  });

  return (
    <>
      <GeneralTable
        apiFilterSort={true}
        isUseApi={true}
        loadTableData={fetchRepos}
        filters={filters}
        tableData={{
          count,
          data,
          isLoading,
          hasError,
        }}
        columnNames={[{ title: 'Name', type: 'name', sort: true }]}
        rows={buildRows}
        actionResolver={actionResolver}
        areActionsDisabled={() => false}
        defaultSort={{ index: 0, direction: 'asc' }}
        toolbarButtons={[
          {
            title: 'Add repository',
            click: () => openModal({ type: 'add' }),
          },
        ]}
      />
    </>
  );
};
RepositoryTable.propTypes = {
  data: PropTypes.array,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  openModal: PropTypes.func,
  fetchRepos: PropTypes.func,
};

export default RepositoryTable;
