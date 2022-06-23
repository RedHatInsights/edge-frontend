import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import EmptyState from '../../components/Empty';
import { routes as paths } from '../../constants/routeMapper';

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
                {Name}
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
      {isLoading !== true && !count > 0 ? (
        <EmptyState
          icon="repository"
          title="No custom repositories available"
          body="Add custom repositories to build RHEL for Edge images with additional packages."
          primaryAction={{
            text: 'Custom repositories',
            href: paths['repositories'],
          }}
        />
      ) : (
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
      )}
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
