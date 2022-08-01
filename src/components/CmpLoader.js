import React from 'react';
import { Skeleton } from '@patternfly/react-core';
import { PropTypes } from 'prop-types';

const CmpLoader = ({ numberOfRows }) => {
  console.log(numberOfRows, 'testing numberOfRows');
  return (
    <React.Fragment>
      <Skeleton />
      <br />
      <Skeleton />
      <br />
      <Skeleton />
      <br />
    </React.Fragment>
  );
};

export default CmpLoader;

CmpLoader.propTypes = {
  numberOfRows: PropTypes.number,
};
