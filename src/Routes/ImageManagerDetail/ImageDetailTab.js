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
    Size: '',
    Description: '',
  };

  const labelsToValueMapperLeftBottom = {
    Username: data?.Images[data.Images.length - 1].Installer.Username || '',
    'SSH Key': data?.Images[data.Images.length - 1].Installer.SshKey || '',
  };

  const labelsToValueMapperRightTop = {
    'Total Additional Packages': '8',
    'Total Packages': '2456',
  };

  const labelsToValueMapperRightBottom = {
    Added: '0',
    Removed: '0',
    Updated: '24',
  };

  if (data?.Installer?.Checksum) {
    labelsToValueMapper['SHA-256 Checksum'] = () => data?.Installer?.Checksum;
  }

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
