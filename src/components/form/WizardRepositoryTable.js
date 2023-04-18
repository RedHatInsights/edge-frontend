import React, { useEffect } from 'react';
import GeneralTable from '../general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import EmptyState from '../Empty';
import { routes as paths } from '../../constants/routeMapper';
import { getCustomRepositories } from '../../api/repositories';
import useApi from '../../hooks/useApi';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { truncateString } from '../../utils';
const filters = [{ label: 'Name', type: 'text' }];

const WizardRepositoryTable = (props) => {
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const isUpdateWizard = getState()?.values?.isUpdate;
  const imageID = getState()?.values?.imageID;

  const [response, fetchRepos] = useApi({
    api: ({ query }) =>
      getCustomRepositories({
        imageID: isUpdateWizard ? imageID.toString() : '',
        query,
      }),
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;

  const getRepoIds = (checked) => {
    const checkedRepos = checked?.map((repo) => ({
      id: repo?.id,
      name: repo?.name,
      URL: repo?.URL,
      uuid: repo?.uuid,
    }));
    input.onChange(checkedRepos);

    checkedRepos.length
      ? change('show-custom-packages', true)
      : change('show-custom-packages', false);
  };

  useEffect(() => {
    change('validate-custom-repos', false);
  }, []);

  const buildRows = ({ data }) => {
    return data.map(({ ID, Name, URL, uuid }) => ({
      rowInfo: { id: ID, name: Name, URL: URL, uuid: uuid },
      cells: [
        {
          title: (
            <>
              <Text className="pf-u-mb-xs" component={TextVariants.p}>
                <span>{truncateString(Name, 50)}</span>
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
    }));
  };

  return (
    <>
      {!isLoading && !data?.count > 0 ? (
        <EmptyState
          icon="repository"
          title="No custom repositories available"
          body="Add custom repositories to build RHEL for Edge images with additional packages."
          primaryAction={{
            text: 'Custom repositories',
            href: paths.repositories,
          }}
        />
      ) : (
        <GeneralTable
          apiFilterSort={true}
          isUseApi={true}
          loadTableData={fetchRepos}
          filters={filters}
          tableData={{
            count: data?.count,
            data,
            isLoading,
            hasError,
          }}
          columnNames={[{ title: 'Name', type: 'name', sort: false }]}
          rows={isLoading ? [] : buildRows(data)}
          defaultSort={{ index: 0, direction: 'desc' }}
          hasCheckbox={true}
          selectedItems={getRepoIds}
          initSelectedItems={input.value}
        />
      )}
    </>
  );
};
WizardRepositoryTable.propTypes = {
  data: PropTypes.array,
  closeModal: PropTypes.func,
};

export default WizardRepositoryTable;
