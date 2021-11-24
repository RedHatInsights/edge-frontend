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
import { edgeImagesReducer } from '../../store/reducers';
import ImageTable from './ImageTable';

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
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(true);
  const [UpdateWizard, setUpdateWizard] = useState({
    isOpen: false,
    imageId: null,
  });
  const history = useHistory();

  const openCreateWizard = () => {
    history.push({
      pathname: history.location.pathname,
      search: new URLSearchParams({
        create_image: true,
      }).toString(),
    });
    setIsCreateWizardOpen(true);
  };

  const openUpdateWizard = (id) => {
    history.push({
      pathname: history.location.pathname,
      search: new URLSearchParams({
        update_image: true,
      }).toString(),
    });
    setUpdateWizard({
      isOpen: true,
      imageId: id,
    });
  };

  useEffect(() => {
    const registered = getRegistry().register({ edgeImagesReducer });
    return () => registered();
  }, []);

  return (
    <Fragment>
      <PageHeader className='pf-m-light'>
        <PageHeaderTitle title='Manage images' />
      </PageHeader>
      <Main className='edge-devices'>
        <ImageTable
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
              history.push({ pathname: history.location.pathname });
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
              history.push({ pathname: history.location.pathname });
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
