import React, { Fragment, useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Spinner, Bullseye } from '@patternfly/react-core';
import { useHistory, useLocation, useNavigate } from 'react-router-dom';
import ImageSetsTable from './ImageSetsTable';
import { stateToUrlSearch } from '../../utils';
import { getImageSets } from '../../api/images';
import useApi from '../../hooks/useApi';
import { ImageContext } from '../../utils/imageContext';
import PropTypes from 'prop-types';

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

const Images = ({ historyProp, locationProp, navigateProp }) => {
  const history = historyProp ? historyProp : useHistory ? useHistory : null;
  const navigate = navigateProp
    ? navigateProp
    : useNavigate
    ? useNavigate
    : null;
  const location = locationProp ? locationProp : useLocation;
  const { pathname, search } = location();
  const imageProps = {
    history: history?.(),
    location: location?.(),
    navigate: navigate?.(),
  };

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

  const openCreateWizard = (navigate, history) => {
    const param = {
      pathname,
      search: stateToUrlSearch('create_image=true', true, search),
    };
    navigate?.({ ...param, replace: true }) || history.push(param);
    setIsCreateWizardOpen(true);
  };

  const openUpdateWizard = (id) => {
    const param = {
      pathname,
      search: stateToUrlSearch('update_image=true', true, search),
    };
    if (imageProps.navigate) {
      imageProps.navigate({ ...param, replace: true });
    } else {
      imageProps.history.push(param);
    }
    // navigate?.({ ...param, replace: true }) || history.push(param);

    setUpdateWizard({
      isOpen: true,
      imageId: id,
    });
  };
  const reload = async () => {
    await fetchImageSets();
    setHasModalSubmitted(true);
  };

  return (
    <ImageContext.Provider value={imageProps}>
      <Fragment>
        <PageHeader className="pf-m-light">
          <PageHeaderTitle title="Images" />
        </PageHeader>
        <section className="edge-images pf-l-page__main-section pf-c-page__main-section">
          <ImageSetsTable
            data={data?.data || []}
            count={data?.count}
            isLoading={isLoading}
            hasError={hasError}
            fetchImageSets={fetchImageSets}
            openCreateWizard={(...props) =>
              openCreateWizard(
                ...props,
                imageProps?.navigate,
                imageProps?.history
              )
            }
            openUpdateWizard={(...props) =>
              openUpdateWizard(
                ...props,
                imageProps?.navigate,
                imageProps?.history
              )
            }
            hasModalSubmitted={hasModalSubmitted}
            setHasModalSubmitted={setHasModalSubmitted}
          />
        </section>
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
                const param = {
                  pathname,
                  search: stateToUrlSearch('create_image=true', false, search),
                };
                navigate?.({ ...param, replace: true }) || history.push(param);
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
                const param = {
                  pathname,
                  search: stateToUrlSearch('update_image=true', false, search),
                };
                navigate?.({ ...param, replace: true }) || history.push(param);
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
    </ImageContext.Provider>
  );
};
Images.propTypes = {
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
};
export default Images;
