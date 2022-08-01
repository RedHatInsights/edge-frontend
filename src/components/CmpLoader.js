import React from 'react';
import { Skeleton } from '@patternfly/react-core';
import { PropTypes } from 'prop-types';

const CmpLoader = ({ numberOfRows }) => {
  var CmpRows = [];
  for (var i = 0; i < numberOfRows; i++) {
    CmpRows.push(<Skeleton />);
    CmpRows.push(<br />);
  }
  return <React.Fragment>{CmpRows}</React.Fragment>;
};

export default CmpLoader;

CmpLoader.propTypes = {
  numberOfRows: PropTypes.number,
};
