import React, { Fragment, useEffect, useState, Suspense } from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useParams } from 'react-router-dom';
import {
  Stack,
  StackItem,
  Text,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';
import PropTypes from 'prop-types';

const UpdateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateImageWizard" */ '../ImageManager/UpdateImageWizard'
  )
);

const ImageSetDetail = ({ data, imagePackageMetadata }) => {
  const { imageId } = useParams();
  const history = useHistory();
  const [updateWizard, setUpdateWizard] = useState({
    isOpen: false,
    updateId: null,
  });
  const [imageData, setImageData] = useState({});

  useEffect(() => {
    setImageData(data);
  }, [data]);

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

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <Stack hasGutter>
          <StackItem>
            <DetailsHead
              imageData={imageData}
              openUpdateWizard={openUpdateWizard}
            />
          </StackItem>
        </Stack>
        <StackItem>
          <Text>{data?.Description}</Text>
        </StackItem>
      </PageHeader>
      <ImageDetailTabs
        imageData={imageData}
        urlParam={imageId}
        openUpdateWizard={openUpdateWizard}
        imagePackageMetadata={imagePackageMetadata}
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

ImageSetDetail.propTypes = {
  data: PropTypes.object,
  imagePackageMetadata: PropTypes.object,
};

export default ImageSetDetail;
