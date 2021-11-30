import React, { useEffect, useState } from 'react';
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Text,
  TextVariants,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { distributionMapper } from './constants';
import PropTypes from 'prop-types';

const ImageDetailTab = ({
  imageData,
  isVersionDetails,
  imagePackageMetadata,
}) => {
  const [data, setData] = useState({});
  const [packageData, setPackageData] = useState({});

  useEffect(() => {
    setData(
      isVersionDetails ? imageData : imageData?.data ? imageData?.data[0] : []
    );
  }, [imageData]);

  useEffect(() => {
    setPackageData(imagePackageMetadata);
  }, [imagePackageMetadata]);

  const dateFormat = () => <DateFormat date={data['CreatedAt']} />;
  const labelsToValueMapperLeftTop = {
    'Image name': 'Name',
    Version: 'Version',
    Created: () => dateFormat(),
    Release: () => distributionMapper[data['Distribution']],
    Size: 'Size',
    Description: 'Description',
  };

  const labelsToValueMapperLeftBottom = {
    Username: data?.Images?.[data?.Images?.length - 1]?.Installer?.Username,
    'SSH Key': data?.Images?.[data?.Images?.length - 1]?.Installer?.SshKey,
  };

  const labelsToValueMapperRightTop = {
    'Total Additional Packages': '8',
    'Total Packages': packageData?.Commit?.InstalledPackages?.length,
  };

  const labelsToValueMapperRightBottom = {
    Added: '0',
    Removed: '0',
    Updated: '24',
  };

  if (data?.Installer?.Checksum) {
    labelsToValueMapperLeftTop['SHA-256 Checksum'] = () =>
      data?.Installer?.Checksum;
  }

  return (
    <TextContent className="pf-u-ml-lg pf-u-mt-md">
      <Flex>
        <FlexItem flex={{ default: 'flex_1' }}>
          <Text component={TextVariants.h3}>Most recent image</Text>
          <TextList component={TextListVariants.dl}>
            {data
              ? Object.entries(labelsToValueMapperLeftTop).map(
                  ([label, value]) => {
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
                  }
                )
              : null}
          </TextList>
          <Text component={TextVariants.h3}>User Information </Text>
          <TextList component={TextListVariants.dl}>
            {data
              ? Object.entries(labelsToValueMapperLeftBottom).map(
                  ([label, value]) => {
                    return (
                      <>
                        <TextListItem component={TextListItemVariants.dt}>
                          {label}
                        </TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>
                          {typeof value === 'function' ? value() : value}
                        </TextListItem>
                      </>
                    );
                  }
                )
              : null}
          </TextList>
        </FlexItem>
        <FlexItem flex={{ default: 'flex_1' }}>
          <Text component={TextVariants.h3}>Packages </Text>
          <TextList component={TextListVariants.dl}>
            {data
              ? Object.entries(labelsToValueMapperRightTop).map(
                  ([label, value]) => {
                    return (
                      <>
                        <TextListItem component={TextListItemVariants.dt}>
                          {label}
                        </TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>
                          {typeof value === 'function' ? value() : value}
                        </TextListItem>
                      </>
                    );
                  }
                )
              : null}
          </TextList>
          <Text component={TextVariants.h3}>Changes from previous version</Text>
          <TextList component={TextListVariants.dl}>
            {data
              ? Object.entries(labelsToValueMapperRightBottom).map(
                  ([label, value]) => {
                    return (
                      <>
                        <TextListItem component={TextListItemVariants.dt}>
                          {label}
                        </TextListItem>
                        <TextListItem component={TextListItemVariants.dd}>
                          {typeof value === 'function' ? value() : value}
                        </TextListItem>
                      </>
                    );
                  }
                )
              : null}
          </TextList>
        </FlexItem>
      </Flex>
    </TextContent>
  );
};

ImageDetailTab.propTypes = {
  imageData: PropTypes.object,
  isVersionDetails: PropTypes.bool,
  imagePackageMetadata: PropTypes.object,
};

export default ImageDetailTab;
