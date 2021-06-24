import React from 'react';
import {
  Text,
  Grid,
  GridItem,
  TextListItem,
  TextVariants,
  TextListItemVariants
} from '@patternfly/react-core';

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
  title: propTypes.string,
  data: propTypes.arrayOf(propTypes.shape({
    name: propTypes.string,
    value: propTypes.string,
  })),
  testid: propTypes.string
};

export default ReviewSection;
