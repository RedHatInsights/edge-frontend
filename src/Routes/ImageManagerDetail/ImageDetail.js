import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { RegistryContext } from '../../store';
import { loadImageSetDetail } from '../../store/actions';
import { imageSetDetailReducer } from '../../store/reducers';
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
    loadImageSetDetail(dispatch, imageId);
    return () => registered();
  }, [dispatch]);

  return (
    <>
      {imageId && <ImageSetDetail data={imageSetData} />}
      {imageVersionId && (
        <ImageVersionDetail
          data={imageVersionData?.data}
          imageSetName={imageSetData?.data?.Name}
        />
      )}
    </>
  );
};

export default ImageDetail;
