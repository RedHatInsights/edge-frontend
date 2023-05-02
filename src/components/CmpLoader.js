import React from 'react';
import { Skeleton } from '@patternfly/react-core';
import { PropTypes } from 'prop-types';

const CmpLoader = ({ numberOfRows }) => {
  var CmpRows = [];

  for (var i = 0; i < numberOfRows; i++) {
    CmpRows.push(
      <React.Fragment key={i}>
        <Skeleton />
        <br />
      </React.Fragment>
    );
  }
  return <React.Fragment>{CmpRows}</React.Fragment>;
};

export default CmpLoader;

CmpLoader.propTypes = {
  numberOfRows: PropTypes.number,
};
