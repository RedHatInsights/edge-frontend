import React, { useEffect } from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import {
  Alert,
  Button,
  Popover,
  Stack,
  StackItem,
  Text,
  TextContent,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { releaseMapper } from '../../../constants';

const CustomRepoAlert = ({ variant, title }) => (
  <Alert
    className="pf-u-mt-lg"
    variant={variant}
    isInline
    title={title}
    style={{ '--pf-c-content--h4--MarginTop': 0 }}
  />
);

CustomRepoAlert.propTypes = {
  variant: PropTypes.string,
  title: PropTypes.string,
};

const checkRepoNameMismatch = (
  initRepos = [],
  currentRepos = [],
  currentPackages = []
) => {
  if (currentRepos.length === 0 && currentPackages.length === 0) {
    return false;
  }
  if (currentRepos.length < initRepos.length) {
    return true;
  }
  // Mismatch if any initial repo is no longer selected
  return !initRepos.every((iRepo) =>
    currentRepos.find((cRepo) => cRepo.name === iRepo.name)
  );
};

const CustomPackageLabel = () => {
  const { getState, change } = useFormApi();
  const addedRepos = getState()?.values?.['third-party-repositories'];
  const initialRepos = getState()?.values?.['initial-custom-repositories'];
  const customPackages = getState()?.values?.['custom-packages'];
  const release = getState()?.values?.release;
  const releaseName = release !== undefined ? releaseMapper[release] : '';

  useEffect(() => {
    change('validate-custom-repos', true);
    change('show-custom-packages', true);
  }, []);

  return (
    <>
      <TextContent>
        <Text>
          Search and choose packages from linked{' '}
          <Popover
            style={{ visibility: 'visible' }}
            position="bottom"
            headerContent="Custom Repositories"
            bodyContent={
              <Stack>
                {addedRepos.map(({ name }) => (
                  <StackItem key={name}>
                    <Text>{name}</Text>
                  </StackItem>
                ))}
              </Stack>
            }
          >
            <Button variant="link" isInline>
              custom {addedRepos.length === 1 ? 'repository' : 'repositories'}
            </Button>
          </Popover>{' '}
          to add to your <b>{releaseName}</b> image.
        </Text>
      </TextContent>
      {addedRepos.length === 0 && customPackages.length > 0 ? (
        <CustomRepoAlert
          variant="danger"
          title="No custom repositories linked. Clear custom packages or link a repository."
        />
      ) : checkRepoNameMismatch(initialRepos, addedRepos, customPackages) ? (
        <CustomRepoAlert
          variant="warning"
          title="Linked custom repositories were removed when these packages were added. Ensure the package list is still correct."
        />
      ) : null}
    </>
  );
};

export default {
  title: 'Additional custom packages',
  name: 'additionalCustomPackages',
  nextStep: 'review',
  substepOf: 'Content',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <CustomPackageLabel />,
    },
    {
      component: 'additional-custom-packages',
      name: 'custom-packages',
      label: 'Available options',
      initialValue: [],
      clearedValue: [],
    },
  ],
};
