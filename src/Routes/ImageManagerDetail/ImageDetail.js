import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Stack, StackItem, Spinner, Bullseye } from '@patternfly/react-core';
import {
  useParams,
  useHistory,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';
import UpdateImageWizard from '../ImageManager/UpdateImageWizard';
import useApi from '../../hooks/useApi';
import { getImageSetView } from '../../api/images';
import { stateToUrlSearch } from '../../utils';

const ImageDetail = ({
  pathPrefix,
  urlName,
  paramsProp,
  historyProp,
  locationProp,
  navigateProp,
  notificationProp,
}) => {
  const { imageId, imageVersionId } = paramsProp
    ? paramsProp()
    : useParams
    ? useParams()
    : null;
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const { pathname, search } = locationProp
    ? locationProp()
    : useLocation
    ? useLocation()
    : null;
  const navigate = navigateProp
    ? navigateProp()
    : useNavigate
    ? useNavigate()
    : null;
  const [updateWizard, setUpdateWizard] = useState({
    isOpen: false,
    updateId: null,
  });
  const [imageVersion, setImageVersion] = useState(null);

  const [response, fetchImageSetDetails] = useApi({
    api: getImageSetView,
    id: imageVersionId ? `${imageId}/versions/${imageVersionId}` : `${imageId}`,
    tableReload: true,
  });

  const { data, isLoading } = response;

  const updateHistoryObj = {
    pathname,
    search: stateToUrlSearch('update_image=true', true, search),
  };

  const openUpdateWizard = (id) => {
    if (navigateProp) {
      navigate({ ...updateHistoryObj, replace: true });
    } else {
      history.push({ ...updateHistoryObj });
    }
    setUpdateWizard((prevState) => ({
      ...prevState,
      isOpen: !prevState.isLoading,
      updateId: id,
    }));
  };

  useEffect(() => {
    imageVersionId
      ? setImageVersion(data?.ImageDetails)
      : setImageVersion(null);
  }, [response, imageVersionId]);

  useEffect(() => {
    fetchImageSetDetails();
  }, [imageId, imageVersionId]);

  const reload = async () => {
    await fetchImageSetDetails();
  };

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <Stack hasGutter>
          <StackItem>
            <DetailsHead
              pathPrefix={pathPrefix}
              urlName={urlName}
              historyProp={historyProp}
              navigateProp={navigateProp}
              imageData={response}
              imageVersion={imageVersion}
              openUpdateWizard={openUpdateWizard}
            />
          </StackItem>
        </Stack>
      </PageHeader>
      <ImageDetailTabs
        pathPrefix={pathPrefix}
        urlName={urlName}
        historyProp={historyProp}
        locationProp={locationProp}
        navigateProp={navigateProp}
        imageData={response}
        urlParam={imageId}
        imageVersion={imageVersion}
        openUpdateWizard={openUpdateWizard}
        isLoading={isLoading}
      />
      {updateWizard.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateImageWizard
            navigateBack={() => {
              if (navigateProp) {
                navigate({ pathname });
              } else {
                history.push({ pathname });
              }
              setUpdateWizard((prevState) => ({ ...prevState, isOpen: false }));
            }}
            updateImageID={updateWizard.updateId}
            reload={reload}
            notificationProp={notificationProp}
            locationProp={locationProp}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

ImageDetail.propTypes = {
  pathPrefix: PropTypes.string,
  urlName: PropTypes.string,
  paramsProp: PropTypes.func,
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
  notificationProp: PropTypes.object,
};

export default ImageDetail;
