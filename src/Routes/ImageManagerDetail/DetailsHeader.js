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
} from '@patternfly/react-core';
import StatusLabel from './StatusLabel';
import { routes as paths } from '../../../package.json';

const DetailsHead = ({ name, status }) => {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to={paths['manage-images']}>Manage Images</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isActive>{name}</BreadcrumbItem>
      </Breadcrumb>

      <TextContent>
        <TextList component="dl">
          <TextListItem component="h1" className="grid-align-center">
            {name}
          </TextListItem>
          <TextListItem className="pf-u-pt-xs" component="dd">
            {status ? <StatusLabel status={status} /> : <Skeleton />}
          </TextListItem>
        </TextList>
      </TextContent>
    </>
  );
};

DetailsHead.propTypes = {
  name: PropTypes.string,
  status: PropTypes.string,
};

export default DetailsHead;
