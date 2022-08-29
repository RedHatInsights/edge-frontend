import React, { Fragment, useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { Spinner, Bullseye } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import ImageSetsTable from './ImageSetsTable';
import { stateToUrlSearch } from '../../utils';
import { getImageSets } from '../../api/images';
import useApi from '../../hooks/useApi';

const CreateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "CreateImageWizard" */ '../ImageManager/CreateImageWizard'
  )
);

const UpdateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateImageWizard" */ '../ImageManager/UpdateImageWizard'
  )
);

const Images = () => {
  const history = useHistory();

  const [response, fetchImageSets] = useApi({
    api: getImageSets,
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;

  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [UpdateWizard, setUpdateWizard] = useState({
    isOpen: false,
    imageId: null,
  });
  const [hasModalSubmitted, setHasModalSubmitted] = useState(false);

  const openCreateWizard = () => {
    history.push({
      pathname: history.location.pathname,
      search: stateToUrlSearch('create_image=true', true),
    });
    setIsCreateWizardOpen(true);
  };

  const openUpdateWizard = (id) => {
    history.push({
      pathname: history.location.pathname,
      search: stateToUrlSearch('update_image=true', true),
    });
    setUpdateWizard({
      isOpen: true,
      imageId: id,
    });
  };

  const reload = () => {
    fetchImageSets();
    setTimeout(() => setHasModalSubmitted(true), 800);
  };

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Images" />
      </PageHeader>
      <Main className="edge-devices">
        <ImageSetsTable
          data={data?.data || []}
          count={data?.count}
          isLoading={isLoading}
          hasError={hasError}
          fetchImageSets={fetchImageSets}
          openCreateWizard={openCreateWizard}
          openUpdateWizard={openUpdateWizard}
          hasModalSubmitted={hasModalSubmitted}
          setHasModalSubmitted={setHasModalSubmitted}
        />
      </Main>
      {isCreateWizardOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <CreateImageWizard
            navigateBack={() => {
              history.push({
                pathname: history.location.pathname,
                search: stateToUrlSearch('create_image=true', false),
              });
              setIsCreateWizardOpen(false);
            }}
            reload={reload}
          />
        </Suspense>
      )}
      {UpdateWizard.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateImageWizard
            navigateBack={() => {
              history.push({
                pathname: history.location.pathname,
                search: stateToUrlSearch('update_image=true', false),
              });
              setUpdateWizard((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            reload={reload}
            updateImageID={UpdateWizard.imageId}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Images;
