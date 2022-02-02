import React, { Fragment, useEffect, useState, Suspense } from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
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

const ImageVersionDetail = ({ data, imageVersion }) => {
  const history = useHistory();
  const [isUpdateWizardOpen, setIsUpdateWizardOpen] = useState(false);
  const [imageData, setImageData] = useState({});

  useEffect(() => {
    setImageData(data);
  }, [data]);

  const openUpdateWizard = () => {
    history.push({
      pathname: history.location.pathname,
      search: new URLSearchParams({
        update_image: true,
      }).toString(),
    });
    setIsUpdateWizardOpen(true);
  };

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <Stack hasGutter>
          <StackItem>
            <DetailsHead
              imageData={imageData}
              imageVersion={imageVersion}
              openUpdateWizard={openUpdateWizard}
            />
          </StackItem>
        </Stack>
        <StackItem>
          <Text>{data?.Description}</Text>
        </StackItem>
      </PageHeader>
      <ImageDetailTabs imageData={imageData} imageVersion={imageVersion} />
      {isUpdateWizardOpen && (
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
              setIsUpdateWizardOpen(false);
            }}
            updateimageVersionId={data?.ID}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

ImageVersionDetail.propTypes = {
  data: PropTypes.object,
  imageVersion: PropTypes.object,
};

export default ImageVersionDetail;
