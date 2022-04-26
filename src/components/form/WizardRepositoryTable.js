import React, { useEffect, useState } from 'react';
import GeneralTable from '../general-table/GeneralTable';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Text, TextVariants } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import EmptyState from '../Empty';
import { routes as paths } from '../../../package.json';
import { getCustomRepositories } from '../../api/index';
import useApi from '../../hooks/useApi';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

import { Modal, Button, Flex } from '@patternfly/react-core';

const filters = [{ label: 'Name', type: 'text' }];

const WizardRepositoryTable = ({ ...props }) => {
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [uncheckedRepo, setUncheckedRepo] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [response] = useApi({ api: getCustomRepositories });
  const { data, isLoading, hasError } = response;
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const wizardState = getState()?.values?.[input.name];

  useEffect(() => {
    change(input.name, selectedRepos);
  }, [selectedRepos]);

  const getUncheckedRepostiories = (previousChecked, newChecked) => {
    return previousChecked.filter((object1) => {
      return !newChecked.some((object2) => {
        return object1.id === object2.id;
      });
    });
  };

  const handleModalToggle = () => {
    let currentCheck = selectedRepos;
    currentCheck.push(uncheckedRepo);
    setSelectedRepos(currentCheck);
    setIsModalOpen(!isModalOpen);
  };

  const modalFooter = (
    <Flex>
      <Button
        key="confirm"
        variant="primary"
        onClick={() => handleModalToggle()}
        isDanger
      >
        Unlink
      </Button>
      <Button key="cancel" variant="link" onClick={() => handleModalToggle()}>
        Cancel
      </Button>
    </Flex>
  );

  const getRepoIds = (checked) => {
    const checkedRepos = checked?.map((repo) => ({
      id: repo?.id,
      name: repo?.name,
      URL: repo?.URL,
    }));
    const uncheckedRepos = getUncheckedRepostiories(
      selectedRepos,
      checkedRepos
    );
    if (uncheckedRepos.length > 0) {
      setUncheckedRepo(uncheckedRepos.shift());
      handleModalToggle();
    }
    setSelectedRepos(checkedRepos);
  };

  const buildRows = ({ data }) => {
    return data.map(({ ID, Name, URL }) => ({
      rowInfo: { id: ID, name: Name, URL: URL },
      noApiSortFilter: [Name],
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
    }));
  };

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
        />
      ) : (
        <React.Fragment>
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
            selectedItems={getRepoIds}
            initSelectedItems={wizardState}
          />
          <Modal
            isOpen={isModalOpen}
            aria-label="My dialog"
            aria-labelledby="custom-header-label"
            aria-describedby="custom-header-description"
            onClose={handleModalToggle}
            title="Unlinking repository?"
            titleIconVariant="warning"
            footer={modalFooter}
            variant="small"
          >
            <span id="custom-header-description">
              X packages from this repository are being used in this image.
              Unlinking the repository will remove the packages.
              <br />
              <br />
              To avoid remove the packages when replacing this repository, link
              the new repository before unlinking the existing one.
            </span>
            <br />
            <br />
            <b>Packages</b>
            <br />
            test-package
            <br />
            <br />
            <b>Name</b>
            <br />
            {uncheckedRepo?.name}
            <br />
            <br />
            <b>BaseURL</b>
            <br />
            {uncheckedRepo?.URL}
          </Modal>
        </React.Fragment>
      )}
    </>
  );
};
WizardRepositoryTable.propTypes = {
  data: PropTypes.array,
  openModal: PropTypes.func,
};

export default WizardRepositoryTable;
