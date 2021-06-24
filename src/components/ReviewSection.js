import React from 'react';
import {
  Text,
  Grid,
  GridItem,
  TextListItem,
  TextVariants,
  TextListItemVariants,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';

const ReviewSection = ({ title, data, testid }) => {
  return (
    <Grid data-testid={testid} hasGutter>
      <GridItem span={12} hasGutter>
        <Text component={TextVariants.h1}>{title}</Text>
      </GridItem>
      {data.map(({ name, value }) => (
        <>
          <GridItem span={3} hasGutter>
            <TextListItem component={TextListItemVariants.dt}>
              {name}
            </TextListItem>
          </GridItem>
          <GridItem style={{ paddingBottom: '20px' }} span={9} hasGutter>
            <TextListItem component={TextListItemVariants.dd}>
              {value}
            </TextListItem>
          </GridItem>
        </>
      ))}
    </Grid>
  );
};

ReviewSection.propTypes = {
  title: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  testid: PropTypes.string,
};

export default ReviewSection;
