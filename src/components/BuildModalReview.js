import React, { Fragment } from 'react';
import {
  Title,
  Text,
  TextContent,
  TextListItemVariants,
  TextListVariants,
  TextList,
  TextListItem,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const BuildModalReview = ({ reviewObject, key }) => {
  return (
    <TextContent>
      <Title headingLevel="h3">
        <Text component={'b'}>{reviewObject.title}</Text>
      </Title>
      <TextList component={TextListVariants.dl}>
        {reviewObject.rows.map((row) => (
          <Fragment key={row.title + key}>
            <TextListItem component={TextListItemVariants.dt}>
              {row.title}
            </TextListItem>
            <TextListItem component={TextListItemVariants.dd}>
              {row.value}
            </TextListItem>
          </Fragment>
        ))}
      </TextList>
    </TextContent>
  );
};

BuildModalReview.propTypes = {
  reviewObject: PropTypes.object,
  key: PropTypes.string,
};

export default BuildModalReview;
