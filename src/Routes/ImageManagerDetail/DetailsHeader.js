import React from 'react';
import { Link } from 'react-router-dom';

import {
  TextList,
  TextListItem,
  TextContent,
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
} from '@patternfly/react-core';
import StatusLabel from './StatusLabel';
import { useSelector, shallowEqual } from 'react-redux';
import { routes as paths } from '../../../package.json';

const DetailsHead = () => {
  const { isLoading, hasError, data } = useSelector(
    ({ imageStatusReducer }) => ({
      isLoading:
        imageStatusReducer?.isLoading !== undefined
          ? imageStatusReducer?.isLoading
          : true,
      hasError: imageStatusReducer?.hasError || false,
      data: imageStatusReducer?.data || null,
    }),
    shallowEqual
  );

  const status = !isLoading && !hasError ? data.Status : null;

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to={paths['manage-images']}>Manage Images</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isActive>{data.Name}</BreadcrumbItem>
      </Breadcrumb>

      <TextContent>
        <TextList component="dl">
          <TextListItem component="h1" className="grid-align-center">
            {data.Name}
          </TextListItem>
          <TextListItem className="pf-u-pt-xs" component="dd">
            {isLoading ? <Skeleton /> : <StatusLabel status={status} />}
          </TextListItem>
        </TextList>
      </TextContent>
    </>
  );
};

export default DetailsHead;
