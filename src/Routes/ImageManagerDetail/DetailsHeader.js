import React from 'react';
import {
  TextList,
  TextListItem,
  TextContent,
  Skeleton,
} from '@patternfly/react-core';
import StatusLabel from './StatusLabel';
import { useSelector, shallowEqual } from 'react-redux';

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
    <TextContent>
      <TextList component="dl">
        <TextListItem component="dt" className="grid-align-center">
          Status
        </TextListItem>
        <TextListItem component="dd">
          {isLoading ? <Skeleton /> : <StatusLabel status={status} />}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

export default DetailsHead;
