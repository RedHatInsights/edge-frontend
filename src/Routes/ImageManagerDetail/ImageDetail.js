import React, { Fragment, useContext, useEffect } from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { useParams } from 'react-router-dom';
import { Stack, StackItem, Text } from '@patternfly/react-core';
import { useDispatch } from 'react-redux';
import { RegistryContext } from '../../store';
import { loadImageStatus } from '../../store/actions';
import { imageStatusReducer } from '../../store/reducers';
import DetailsHead from './DetailsHeader';
import ImageDetailTabs from './ImageDetailTabs';

const ImageDetail = () => {
  const { imageId } = useParams();
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const registered = getRegistry().register({ imageStatusReducer });
    loadImageStatus(dispatch, imageId);
    return () => registered();
  }, [dispatch]);
  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <Stack hasGutter>
          <StackItem>
            <DetailsHead />
          </StackItem>
        </Stack>
        <StackItem>
          <Text>{/*Image description*/}</Text>
        </StackItem>
      </PageHeader>
      <ImageDetailTabs />
    </Fragment>
  );
};

export default ImageDetail;
