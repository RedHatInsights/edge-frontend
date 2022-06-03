import React, {
  Fragment,
  useState,
  useEffect,
  useContext,
  Suspense,
} from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { Spinner, Bullseye } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import { RegistryContext } from '../../store';
import { edgeImageSetsReducer } from '../../store/reducers';
import ImageSetsTable from './ImageSetsTable';
import { stateToUrlSearch } from '../../utils';

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
  const { getRegistry } = useContext(RegistryContext);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [UpdateWizard, setUpdateWizard] = useState({
    isOpen: false,
    imageId: null,
  });
  const history = useHistory();

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
  useEffect(() => {
    const registered = getRegistry().register({ edgeImageSetsReducer });
    return () => registered();
  }, []);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Images" />
      </PageHeader>
      <Main className="edge-devices">
        <ImageSetsTable
          openCreateWizard={openCreateWizard}
          openUpdateWizard={openUpdateWizard}
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
            updateImageID={UpdateWizard.imageId}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Images;
