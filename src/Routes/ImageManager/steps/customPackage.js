import React from 'react';
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
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import { releaseMapper } from '../../../constants';

const showAlert = (type) => {
  <Alert
    className="pf-u-mt-lg"
    variant={type}
    isInline
    title={type === 'danger' ? 'blargh' : 'bleh'}
    style={{ '--pf-c-content--h4--MarginTop': 0 }}
  />;
};

// const checkRepoNameMismatch = (initRepos, currentRepos) => {
//   if (initRepos.length !== currentRepos) {
//     return true;
//   }

//   initRepos.forEach((iRepo) => {
//     const foundRepo = currentRepos.find((cRepo) => cRepo.name === iRepo.name);
//     if (!foundRepo) {
//       return true;
//     }
//   });

//   return false;
// };

const CustomPackageLabel = () => {
  const { getState } = useFormApi();
  const addedRepos = getState()?.values?.['third-party-repositories'];
  const customPackages = getState()?.values?.['custom-packages'];

  const release = getState()?.values?.release;
  const releaseName = release !== undefined ? releaseMapper[release] : '';

  /*
        addedRepos = current state of what's checked
        initRepo:
            if 0:
                track nothing = []
            else:
                initRepos = addedRepos

        alert:
            if addedRepos != initRepos
                warning
            elif addedRepos == 0 && packages >= 1
                danger
    */

  console.log(addedRepos);
  return (
    <>
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
        </Text>
      </TextContent>
      {addedRepos.length == 0 &&
        customPackages.length > 0 &&
        showAlert('danger')}
    </>
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
