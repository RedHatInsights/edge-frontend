import React, { Fragment, useEffect, useState } from 'react';
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
  Skeleton,
} from '@patternfly/react-core';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { distributionMapper } from '../../constants';
import PropTypes from 'prop-types';
import { routes as paths } from '../../constants/routeMapper';
import { Link } from 'react-router-dom';

const ImageDetailTab = ({ imageData, imageVersion }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    imageVersion
      ? setData(imageVersion)
      : setData(imageData?.data?.Data?.images?.[0]);
  }, [imageData, imageVersion]);

  const createSkeleton = (rows) =>
    [...Array(rows * 2)].map((_, key) => <Skeleton width="180px" key={key} />);

  const dateFormat = () => <DateFormat date={data?.image?.['CreatedAt']} />;

  const detailsMapper = {
    Version: 'Version',
    Created: () => dateFormat(),
    'Type(s)': () =>
      data?.image?.['OutputTypes']?.map((outputType, index) => (
        <div key={index}>{outputType}</div>
      )),
    Release: () => distributionMapper?.[data?.image?.['Distribution']],
    //Size: 'Size',
    Description: 'Description',
  };

  const userInfoMapper = {
    Username: () => data?.image?.Installer?.Username,
    'SSH key': () => data?.image?.Installer?.SshKey,
  };
  const renderAdditionalPackageLink = () => {
    return (
      <Link
        to={`${paths['manage-images']}/${data?.image?.ImageSetID}/versions/${data?.image?.ID}/packages/additional`}
      >
        {data?.additional_packages}
      </Link>
    );
  };

  const renderTotalPackageLink = () => {
    return (
      <Link
        to={`${paths['manage-images']}/${data?.image?.ImageSetID}/versions/${data?.image?.ID}/packages/all`}
      >
        {data?.packages}
      </Link>
    );
  };

  const packageMapper = {
    'Total additional packages': renderAdditionalPackageLink,
    'Total packages': renderTotalPackageLink,
  };

  const packageDiffMapper = {
    Added: () => data?.update_added,
    Removed: () => data?.update_removed,
    Updated: () => data?.update_updated,
  };

  if (data?.image?.Installer?.Checksum) {
    detailsMapper['SHA-256 checksum'] = () => data?.image?.Installer?.Checksum;
  }

  if (data?.image?.Commit?.OSTreeCommit) {
    detailsMapper['Ostree commit hash'] = () =>
      data?.image?.Commit?.OSTreeCommit;
  }

  const buildTextList = (labelsToValueMapper) =>
    data
      ? Object.entries(labelsToValueMapper).map(([label, value], index) => {
          return (
            <Fragment key={index}>
              <TextListItem
                className="details-label"
                component={TextListItemVariants.dt}
              >
                {label}
              </TextListItem>
              {label === 'SHA-256 checksum' ||
              label === 'Ostree commit hash' ||
              (label === 'SSH key' && value()) ? (
                <TextListItem component={TextListItemVariants.dd}>
                  <ClipboardCopy
                    hoverTip="Copy"
                    clickTip="Copied"
                    variant="expansion"
                    className="pf-u-text-break-word"
                    id={`${label
                      .replace(/\s+/g, '-')
                      .toLowerCase()}-clipboard-copy`}
                  >
                    {typeof value === 'function'
                      ? value() || 'Unavailable'
                      : data?.image?.[value] || 'Unavailable'}
                  </ClipboardCopy>
                </TextListItem>
              ) : (
                <TextListItem
                  className="pf-u-text-break-word"
                  component={TextListItemVariants.dd}
                >
                  {typeof value === 'function'
                    ? value() === 0
                      ? 0
                      : value() || 'Unavailable'
                    : data?.image?.[value] || 'Unavailable'}
                </TextListItem>
              )}
            </Fragment>
          );
        })
      : null;

  return (
    <TextContent className="pf-u-ml-lg pf-u-mt-md">
      <Grid span={12}>
        <GridItem span={5}>
          <Text component={TextVariants.h2}>
            {imageVersion ? 'Details' : 'Most recent image'}
          </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(detailsMapper) || createSkeleton(6)}
          </TextList>
          <Text component={TextVariants.h2}>User information </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(userInfoMapper) || createSkeleton(2)}
          </TextList>
        </GridItem>
        <GridItem span={1} />
        <GridItem span={6}>
          <Text component={TextVariants.h2}>Packages </Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(packageMapper) || createSkeleton(3)}
          </TextList>
          <Text component={TextVariants.h2}>Changes from previous version</Text>
          <TextList component={TextListVariants.dl}>
            {buildTextList(packageDiffMapper) || createSkeleton(3)}
          </TextList>
        </GridItem>
      </Grid>
    </TextContent>
  );
};

ImageDetailTab.propTypes = {
  imageData: PropTypes.object,
  imageVersion: PropTypes.object,
};

export default ImageDetailTab;
