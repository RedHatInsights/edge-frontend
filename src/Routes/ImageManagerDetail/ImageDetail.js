import React, { Fragment, Suspense, useEffect, useState } from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Stack, StackItem, Spinner, Bullseye } from '@patternfly/react-core';
import { useParams, useHistory } from 'react-router-dom';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';
import UpdateImageWizard from '../ImageManager/UpdateImageWizard';
import useApi from '../../hooks/useApi';
import { getImageSet } from '../../api/images';

const ImageDetail = () => {
  const { imageId, imageVersionId } = useParams();
  const history = useHistory();
  const [updateWizard, setUpdateWizard] = useState({
    isOpen: false,
    updateId: null,
  });
  const [imageVersion, setImageVersion] = useState(null);

  const [response, fetchImageSetDetails] = useApi({
    api: getImageSet,
    id: imageId,
    tableReload: true,
  });

  const { data, isLoading } = response;

  const openUpdateWizard = (id) => {
    history.push({
      pathname: history.location.pathname,
      search: new URLSearchParams({
        update_image: true,
      }).toString(),
    });
    setUpdateWizard((prevState) => ({
      ...prevState,
      isOpen: !prevState.isLoading,
      updateId: id,
    }));
  };

  useEffect(() => {
    imageVersionId
      ? setImageVersion(
          data?.Data?.images?.[
            data?.Data?.images?.findIndex(
              (image) => image?.image?.ID == imageVersionId
            )
          ]
        )
      : setImageVersion(null);
  }, [response, imageVersionId]);

  useEffect(() => {
    fetchImageSetDetails();
  }, [imageId]);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <Stack hasGutter>
          <StackItem>
            <DetailsHead
              imageData={response}
              imageVersion={imageVersion}
              openUpdateWizard={openUpdateWizard}
            />
          </StackItem>
        </Stack>
      </PageHeader>
      <ImageDetailTabs
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
              history.push({ pathname: history.location.pathname });
              setUpdateWizard((prevState) => ({ ...prevState, isOpen: false }));
            }}
            updateImageID={updateWizard.updateId}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default ImageDetail;
