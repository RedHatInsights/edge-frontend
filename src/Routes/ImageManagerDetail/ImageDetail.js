import React, { Fragment, useContext, useEffect } from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useParams } from 'react-router-dom';
import { Stack, StackItem, Text } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';
import { RegistryContext } from '../../store';
import { loadImageDetail } from '../../store/actions';
import { imageDetailReducer } from '../../store/reducers';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';
import { useSelector, shallowEqual } from 'react-redux';

const ImageDetail = () => {
  const { imageId } = useParams();
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();

  const { data } = useSelector(
    ({ imageDetailReducer }) => ({ data: imageDetailReducer?.data || null }),
    shallowEqual
  );

  useEffect(() => {
    const registered = getRegistry().register({
      imageDetailReducer,
    });
    loadImageDetail(dispatch, imageId);
    return () => registered();
  }, [dispatch]);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <Stack hasGutter>
          <StackItem>
            <DetailsHead name={data?.Name} status={data?.Status} />
          </StackItem>
        </Stack>
        <StackItem>
          <Text>{data?.Description}</Text>
        </StackItem>
      </PageHeader>
      <ImageDetailTabs />
    </Fragment>
  );
};

export default ImageDetail;
