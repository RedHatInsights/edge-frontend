import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  TextList,
  TextListItem,
  TextContent,
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import StatusLabel from './StatusLabel';
import ImageDetailActions from './ImageDetailActions';
import { routes as paths } from '../../../package.json';

const DetailsHead = ({ imageData, openUpdateWizard }) => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to={paths['manage-images']}>Manage Images</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isActive>{imageData?.name}</BreadcrumbItem>
      </Breadcrumb>

      <TextContent>
        <Split>
          <SplitItem>
            <TextList component="dl">
              <TextListItem component="h1" className="grid-align-center">
                {imageData?.name}
              </TextListItem>
              <TextListItem component="dd">
                {imageData?.status ? (
                  <StatusLabel status={imageData?.status} />
                ) : (
                  <Skeleton />
                )}
              </TextListItem>
            </TextList>
          </SplitItem>
          <SplitItem isFilled></SplitItem>
          {imageData?.status === 'SUCCESS' ? (
            <ImageDetailActions
              imageData={imageData}
              openUpdateWizard={openUpdateWizard}
            />
          ) : null}
        </Split>
      </TextContent>
    </>
  );
};

DetailsHead.propTypes = {
  openUpdateWizard: PropTypes.func,
  imageData: PropTypes.shape({
    ID: PropTypes.number,
    Name: PropTypes.string,
    Status: PropTypes.string,
  }),
};

export default DetailsHead;
