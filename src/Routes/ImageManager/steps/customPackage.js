import React, { useEffect, useState } from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import {
  Alert,
  Button,
  Text,
  TextContent,
  Popover,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { releaseMapper } from '../../../constants';

const CustomPackageLabel = () => {
  const banners = {
    warning: (
      <Alert
        style={{ '--pf-c-content--h4--MarginTop': 0 }} //due to component's lack of responsive need to override property
        variant="warning"
        isInline
        title="Linked custom repositories were removed when these packages were added. Ensure the package list is still correct."
      />
    ),
    error: (
      <Alert
        style={{ '--pf-c-content--h4--MarginTop': 0 }} //due to component's lack of responsive need to override property
        variant="danger"
        isInline
        title="No custom repositories linked. Clear custom packages or link a repository."
      />
    ),
    noBanner: <></>,
  };
  const BANNER_WARNING = 'warning';
  const BANNER_ERROR = 'error';
  const { change, getState } = useFormApi();
  const [banner, setBanner] = useState('noBanner');
  const addedRepos = getState()?.values?.['added-repositories'];
  const originalRepos = getState()?.values?.['third-party-repositories'];
  const release = getState()?.values?.release;
  const releaseName = release !== undefined ? releaseMapper[release] : '';

  useEffect(() => {
    change('third-party-repositories', addedRepos);
    if (originalRepos.length > 0 && addedRepos.length == 0) {
      setBanner(BANNER_ERROR);
      return;
    }
    originalRepos.forEach((originalRepo) => {
      if (
        addedRepos.filter((addedRepo) => addedRepo.id === originalRepo.id)
          .length === 0
      ) {
        setBanner(BANNER_WARNING);
        return;
      }
    });
  }, [addedRepos]);

  return (
    <TextContent>
      <Text>
        Add packages from{' '}
        <Popover
          style={{ visibility: 'visible' }}
          position="bottom"
          headerContent="Custom Repositories"
          bodyContent={
            <Stack>
              {addedRepos.map((repo) => (
                <StackItem key={repo}>
                  <Text>{repo.name}</Text>
                </StackItem>
              ))}
            </Stack>
          }
        >
          <Button variant="link" isInline>
            {addedRepos.length} custom repositories
          </Button>{' '}
          to your
        </Popover>
        <b> {releaseName}</b> image.
        {banners[banner]}
      </Text>
    </TextContent>
  );
};

export default {
  title: 'Custom packages',
  name: 'customPackages',
  nextStep: 'packages',
  substepOf: 'Add content',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: <CustomPackageLabel />,
    },
    {
      component: 'custom-package-text-area',
      style: {
        paddingRight: '32px',
        height: '25vh',
      },
      name: 'custom-packages',
      initialValue: [],
      clearedValue: [],
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'packageDetails',
      label: (
        <Text>
          Specify individual packages by exact name and casing, with no
          whitespace, one entry to a line, and can include hyphens ( - ).
        </Text>
      ),
    },
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'warning',
      label: (
        <Text className="pf-u-warning-color-200">
          <ExclamationTriangleIcon class="pf-u-warning-color-100" />
          &nbsp; Packages names that do not have exact name and casing will not
          be included in the image.
        </Text>
      ),
    },
  ],
};
