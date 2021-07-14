import React from 'react';
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import { useSelector, shallowEqual } from 'react-redux';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { distributionMapper, imageTypeMapper } from './constants';

const ImageDetailTab = () => {
  const { data } = useSelector(
    ({ imageDetailReducer }) => ({ data: imageDetailReducer?.data || null }),
    shallowEqual
  );

  const dateFormat = () => <DateFormat date={data['CreatedAt']} />;
  const labelsToValueMapper = {
    'Image name': 'Name',
    Version: 'Version',
    Created: () => dateFormat(),
    Release: () => distributionMapper[data['Distribution']],
    'Output type': () => imageTypeMapper[data['ImageType']],
    'Added packages': () => data.Commit.Packages.length,
    'Base Packages': () => 0,
    Dependancies: () => 0,
  };

  return (
    <TextContent className="pf-u-ml-lg pf-u-mt-md">
      <TextList component={TextListVariants.dl}>
        {data
          ? Object.entries(labelsToValueMapper).map(([label, value]) => {
              return (
                <>
                  <TextListItem component={TextListItemVariants.dt}>
                    {label}
                  </TextListItem>
                  <TextListItem component={TextListItemVariants.dd}>
                    {typeof value === 'function' ? value() : data[value]}
                  </TextListItem>
                </>
              );
            })
          : null}
      </TextList>
    </TextContent>
  );
};

export default ImageDetailTab;
