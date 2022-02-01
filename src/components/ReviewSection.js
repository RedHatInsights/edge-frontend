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
    <Grid className='pf-u-pb-xl' data-testid={testid} hasGutter>
      <GridItem span={12}>
        <Text component={TextVariants.h2}>{title}</Text>
      </GridItem>
      {data.map(({ name, value }) => (
        <Grid key={name}>
          <GridItem span={3}>
            <TextListItem component={TextListItemVariants.dt}>
              {name}
            </TextListItem>
          </GridItem>
          <GridItem span={9}>
            <TextListItem component={TextListItemVariants.dd}>
              {value}
            </TextListItem>
          </GridItem>
        </Grid>
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
