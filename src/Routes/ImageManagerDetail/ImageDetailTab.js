import React from 'react';
import {
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';

const ImageDetailTab = () => {
  const labelsToValueMapper = {
    'Image name': 'Name',
    Version: 'Version',
    Created: 'CreatedAt',
    Release: 'Distribution',
    'Output type': '',
    'Added packages': 'Packages',
    'Base Packages': '',
    Dependancies: '',
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
                {value}
              </TextListItem>
            </>
          );
        })}
      </TextList>
    </TextContent>
  );
};

export default ImageDetailTab;
