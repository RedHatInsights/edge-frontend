import React, {
  Fragment,
  Suspense,
  useEffect,
  useContext,
  useState,
} from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
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
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';
import UpdateImageWizard from '../ImageManager/UpdateImageWizard';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';

const ImageDetail = () => {
  const { imageId, imageVersionId } = useParams();
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
  const history = useHistory();
  const [updateWizard, setUpdateWizard] = useState({
    isOpen: false,
    updateId: null,
  });
  const [imageVersion, setImageVersion] = useState(null);

  const imageSetData = useSelector(
    ({ imageSetDetailReducer }) => ({
      data: imageSetDetailReducer?.data || null,
      isLoading: imageSetDetailReducer?.isLoading,
      hasError: imageSetDetailReducer?.hasError,
    }),
    shallowEqual
  );

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
          imageSetData?.data?.Data?.images?.[
            imageSetData?.data?.Data?.images?.findIndex(
              (image) => image?.image?.ID == imageVersionId
            )
          ]
        )
      : setImageVersion(null);
  }, [imageSetData, imageVersionId]);

  useEffect(() => {
    const registered = getRegistry().register({
      imageSetDetailReducer,
    });
    loadImageSetDetail(dispatch, imageId);
    return () => registered();
  }, [imageId]);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <Stack hasGutter>
          <StackItem>
            <DetailsHead
              imageData={imageSetData}
              imageVersion={imageVersion}
              openUpdateWizard={openUpdateWizard}
            />
          </StackItem>
        </Stack>
        <StackItem>
            {imageSetData?.data?.Data && 
            <Text>{`Last updated `}
              <DateFormat 
              date={imageVersion
                ? imageVersion?.image?.UpdatedAt
                : imageSetData?.data?.Data?.images?.[
                    imageSetData?.data?.Data?.images?.length - 1
                  ].image?.UpdatedAt}
              />
            </Text>}
        </StackItem>
      </PageHeader>
      <ImageDetailTabs
        imageData={imageSetData}
        urlParam={imageId}
        imageVersion={imageVersion}
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
