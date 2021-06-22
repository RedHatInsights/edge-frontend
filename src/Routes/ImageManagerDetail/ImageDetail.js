import React, { Fragment, useContext, useEffect } from 'react';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Link, useParams } from 'react-router-dom';
import {
  Stack,
  StackItem,
  Breadcrumb,
  BreadcrumbItem,
  Title,
} from '@patternfly/react-core';
import { routes as paths } from '../../../package.json';
import { useDispatch } from 'react-redux';
import { RegistryContext } from '../../store';
import { loadImageStatus } from '../../store/actions';
import { imageStatusReducer } from '../../store/reducers';
import DetailsHead from './DetailsHeader';

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
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={paths['manage-images']}>Manged images</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>{imageId}</BreadcrumbItem>
        </Breadcrumb>
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h1" size="2xl">
              {imageId}
            </Title>
          </StackItem>
          <StackItem>
            <DetailsHead />
          </StackItem>
        </Stack>
      </PageHeader>
    </Fragment>
  );
};

export default ImageDetail;
