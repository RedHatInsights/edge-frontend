import React from 'react';
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';

const ImageDetailTab = () => {
  const data = {
    Name: 'Point of Sale',
    Version: 2,
    CreatedAt: '30 Jun 2021',
    Distribution: 'RHEL 8.4',
    OutputType: 'RHEL for Edge Commit(.tar)',
    Packages: 3,
    BasePackages: 0,
    Dependancies: 0,
  };
  const labelsToValueMapper = {
    'Image name': 'Name',
    Version: 'Version',
    Created: 'CreatedAt',
    Release: 'Distribution',
    'Output type': 'OutputType',
    'Added packages': 'Packages',
    'Base Packages': 'BasePackages',
    Dependancies: 'Dependancies',
  };

  return (
    <TextContent className="pf-u-ml-lg pf-u-mt-md">
      <TextList component={TextListVariants.dl}>
        {Object.entries(labelsToValueMapper).map(([label, value]) => {
          return (
            <>
              <TextListItem component={TextListItemVariants.dt}>
                {label}
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd}>
                {data[value]}
              </TextListItem>
            </>
          );
        })}
      </TextList>
    </TextContent>
  );
};

export default ImageDetailTab;
