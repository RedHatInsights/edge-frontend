import React from 'react';
import { Skeleton } from '@patternfly/react-core';

const CmpLoader = () => {
  return (
    <>
      <React.Fragment>
        <Skeleton />
        <br />
        <Skeleton />
        <br />
        <Skeleton />
        <br />
      </React.Fragment>
    </>
  );
};

export default CmpLoader;
