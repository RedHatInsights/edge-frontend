import React, { useEffect, useState } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import { getCustomRepositories } from '../../api/index';
import PropTypes from 'prop-types';
import { Skeleton } from '@patternfly/react-core';

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

  const reloadData = async () => {
    const repos = await getCustomRepositories();
    setInternalData(
      repos.data.map((repo) => ({
        id: repo.ID,
        name: repo.Name,
        baseURL: repo.URL,
        ...repo,
      }))
    );
    setLoaded(true);
  };

  const getDataSource = () => (data ? data : internalData ? internalData : []);

  const getTableData = () => {
    return {
      count: getDataSource().length,
      data: getDataSource(),
      isLoading: false,
      hasError: false,
    };
  };

  useEffect(() => reloadData(), []);

  const buildRows = getDataSource().map(({ id, name, baseURL }) => {
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

  return loaded ? (
    <GeneralTable
      apiFilterSort={false}
      filters={filters}
      tableData={getTableData()}
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
  ) : (
    <Skeleton />
  );
};
RepositoryTable.propTypes = {
  data: PropTypes.array,
  openModal: PropTypes.func,
};

export default RepositoryTable;
