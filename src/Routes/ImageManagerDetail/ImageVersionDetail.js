import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  Suspense,
} from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useParams } from 'react-router-dom';
import {
  Stack,
  StackItem,
  Text,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import { useDispatch } from 'react-redux';
import { RegistryContext } from '../../store';
import { loadImageDetail } from '../../store/actions';
import { imageDetailReducer } from '../../store/reducers';
import { useHistory } from 'react-router-dom';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';
import PropTypes from 'prop-types';

const UpdateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateImageWizard" */ '../ImageManager/UpdateImageWizard'
  )
);

const ImageVersionDetail = ({ data, imageSetName, imagePackageMetadata }) => {
  const { imageVersionId } = useParams();
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isUpdateWizardOpen, setIsUpdateWizardOpen] = useState(false);
  const [imageData, setImageData] = useState({});

  useEffect(() => {
    setImageData(data);
  }, [data]);

  useEffect(() => {
    const registered = getRegistry().register({
      imageDetailReducer,
    });
    loadImageDetail(dispatch, imageVersionId);
    return () => registered();
  }, [dispatch]);

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
              isVersionDetails={true}
              imageSetName={imageSetName}
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
        isVersionDetails={true}
        imagePackageMetadata={imagePackageMetadata}
      />
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
  imageSetName: PropTypes.string,
  imagePackageMetadata: PropTypes.string,
};

export default ImageVersionDetail;
