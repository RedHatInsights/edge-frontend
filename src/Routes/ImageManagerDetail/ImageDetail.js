import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { RegistryContext } from '../../store';
import { loadImageSetDetail } from '../../store/actions';
import { imageSetDetailReducer } from '../../store/reducers';
import { imagePackageMetadataReducer } from '../../store/reducers';
import { loadImagePackageMetadata } from '../../store/actions';
import { useParams } from 'react-router-dom';
import ImageSetDetail from './ImageSetDetail';
import ImageVersionDetail from './ImageVersionDetail';
import { useSelector, shallowEqual } from 'react-redux';

const ImageDetail = () => {
  const { imageId, imageVersionId } = useParams();
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();

  const imageVersionData = useSelector(
    ({ imageDetailReducer }) => ({ data: imageDetailReducer?.data || null }),
    shallowEqual
  );

  const imagePackageMetadata = useSelector(
    ({ imagePackageMetadataReducer }) => ({
      data: imagePackageMetadataReducer?.data || null,
    }),
    shallowEqual
  );

  const imageSetData = useSelector(
    ({ imageSetDetailReducer }) => ({
      data: imageSetDetailReducer?.data?.Data || null,
      isLoading: imageSetDetailReducer?.isLoading,
      hasError: imageSetDetailReducer?.hasError,
    }),
    shallowEqual
  );

  useEffect(() => {
    const registered = getRegistry().register({
      imageSetDetailReducer,
    });
    imageId
      ? loadImageSetDetail(dispatch, imageId)
      : imageVersionData?.data?.ImageSetID
      ? loadImageSetDetail(dispatch, imageVersionData?.data?.ImageSetID)
      : null;
    return () => registered();
  }, [dispatch, imageVersionData]);

  useEffect(() => {
    const registered = getRegistry().register({
      imagePackageMetadataReducer,
    });
    imageVersionId
      ? loadImagePackageMetadata(dispatch, imageVersionId)
      : imageSetData?.data
      ? loadImagePackageMetadata(dispatch, imageSetData?.data?.[0]?.ID)
      : null;
    return () => registered();
  }, [dispatch, imageSetData]);

  return (
    <>
      {imageId && (
        <ImageSetDetail
          data={imageSetData}
          imagePackageMetadata={imagePackageMetadata?.data}
        />
      )}
      {imageVersionId && (
        <ImageVersionDetail
          data={imageVersionData?.data}
          imageSetName={imageSetData?.data?.[0]?.Name}
          imagePackageMetadata={imagePackageMetadata?.data}
        />
      )}
    </>
  );
};

export default ImageDetail;
