import React, { useEffect } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import EmptyState from '../../components/Empty';
import { routes as paths } from '../../../package.json';
import { getCustomRepositories } from '../../api/index';
import useApi from '../../hooks/useApi';

const filters = [{ label: 'Name', type: 'text' }];

const WizardRepositoryTable = () => {
  const [response] = useApi(getCustomRepositories);
  const { data, isLoading, hasError } = response;

  useEffect(() => {
    console.log(response);
  }, [response]);

  const buildRows = ({ data }) =>
    data.map(({ ID, Name, URL }) => {
      return {
        id: ID,
        repoName: Name,
        repoBaseURL: URL,
        noApiSortFilter: [Name, URL],
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
      {isLoading !== true && !data?.count > 0 ? (
        <EmptyState
          icon="repository"
          title="No custom repositories available"
          body="Add custom repositories to build RHEL for Edge images with additional packages."
          primaryAction={{
            text: 'Custom repositories',
            href: paths['repositories'],
          }}
          secondaryActions={
            [
              //{
              //  title: 'Learn more about custom repositories',
              //  type: 'link',
              //  link: '#',
              //},
            ]
          }
        />
      ) : (
        <GeneralTable
          apiFilterSort={false}
          filters={filters}
          tableData={{
            count: data?.length,
            data,
            isLoading,
            hasError,
          }}
          columnNames={[{ title: 'Name', type: 'name', sort: true }]}
          rows={isLoading ? [] : buildRows(data)}
          defaultSort={{ index: 0, direction: 'desc' }}
          hasCheckbox={true}
        />
      )}
    </>
  );
};
WizardRepositoryTable.propTypes = {
  data: PropTypes.array,
  openModal: PropTypes.func,
};

export default WizardRepositoryTable;
