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
import { loadImageSetDetail } from '../../store/actions';
import { imageSetDetailReducer } from '../../store/reducers';
import { useHistory } from 'react-router-dom';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';
import { useSelector, shallowEqual } from 'react-redux';

const UpdateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateImageWizard" */ '../ImageManager/UpdateImageWizard'
  )
);

const ImageDetail = () => {
  const { imageId } = useParams();
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const [updateWizard, setUpdateWizard] = useState({
    isOpen: false,
    updateId: null,
  });
  const [imageData, setImageData] = useState({});

  const data = useSelector(
    ({ imageSetDetailReducer }) => ({
      data: imageSetDetailReducer?.data?.Data || null,
      isLoading: imageSetDetailReducer?.isLoading,
      hasError: imageSetDetailReducer?.hasError,
    }),
    shallowEqual
  );

  useEffect(() => {
    setImageData(data);
  }, [data]);

  useEffect(() => {
    const registered = getRegistry().register({
      imageSetDetailReducer,
    });
    loadImageSetDetail(dispatch, imageId);
    return () => registered();
  }, [dispatch]);

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
