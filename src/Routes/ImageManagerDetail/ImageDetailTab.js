import React, { useEffect, useState } from 'react';
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  Text,
  TextVariants,
  Grid,
  GridItem,
  ClipboardCopy,
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
      isVersionDetails
        ? imageData
        : imageData?.data
        ? imageData?.data?.Images?.[0]
        : []
    );
  }, [imageData]);

  useEffect(() => {
    setPackageData(imagePackageMetadata);
  }, [imagePackageMetadata]);

  const dateFormat = () => <DateFormat date={data['CreatedAt']} />;

  const detailsMapper = {
    'Image name': 'Name',
    Version: 'Version',
    Created: () => dateFormat(),
    'Type(s)': () =>
      data?.['OutputTypes']?.map((outputType, index) => (
        <div key={index}>{outputType}</div>
      )),
    Release: () => distributionMapper?.[data?.['Distribution']],
    //Size: 'Size',
    Description: 'Description',
  };

  const userInfoMapper = {
    Username: () => data?.Installer?.Username,
    'SSH Key': () => data?.Installer?.SshKey,
  };

  const packageMapper = {
    'Total Additional Packages': () => data?.Packages?.length,
    'Total Packages': () => packageData?.Commit?.InstalledPackages?.length,
  };

  // const packageDiffMapper = {
  //   Added: 'Currently unavailable',
  //   Removed: 'Currently unavailable',
  //   Updated: 'Currently unavailable',
  // };

  if (data?.Installer?.Checksum) {
    detailsMapper['SHA-256 Checksum'] = () => data?.Installer?.Checksum;
  }

  const buildTextList = (labelsToValueMapper) =>
    data
      ? Object.entries(labelsToValueMapper).map(([label, value]) => {
          return (
            <>
              <TextListItem
                className="details-label"
                component={TextListItemVariants.dt}
              >
                {label}
              </TextListItem>
              {console.log(label)}
              {label === 'SHA-256 Checksum' || label === 'SSH Key' ? (
                <ClipboardCopy
                  hoverTip="Copy"
                  clickTip="Copied"
                  variant="inline-compact"
                >
                  <TextListItem component={TextListItemVariants.dd}>
                    {typeof value === 'function'
                      ? value() || 'Currently unavailable'
                      : data[value] || 'Currently unavailable'}
                  </TextListItem>
                </ClipboardCopy>
              ) : (
                <TextListItem
                  className="pf-u-text-break-word"
                  component={TextListItemVariants.dd}
                >
                  {typeof value === 'function'
                    ? value() || 'Currently unavailable'
                    : data[value] || 'Currently unavailable'}
                </TextListItem>
              )}
            </>
          );
        })
      : null;

  return (
    <TextContent className="pf-u-ml-lg pf-u-mt-md">
      <Grid span={12}>
        <GridItem span={6}>
          <Text component={TextVariants.h2}>
            {isVersionDetails ? 'Details' : 'Most recent image'}
          </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(detailsMapper)}
          </TextList>
          <Text component={TextVariants.h2}>User Information </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(userInfoMapper)}
          </TextList>
        </GridItem>
        <GridItem span={6}>
          <Text component={TextVariants.h2}>Packages </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(packageMapper)}
          </TextList>
          {/* <Text component={TextVariants.h2}>Changes from previous version</Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(packageDiffMapper)}
          </TextList> */}
        </GridItem>
      </Grid>
    </TextContent>
  );
};

ImageDetailTab.propTypes = {
  imageData: PropTypes.object,
  isVersionDetails: PropTypes.bool,
  imagePackageMetadata: PropTypes.object,
  labelsToValueMapper: PropTypes.object,
};

export default ImageDetailTab;
