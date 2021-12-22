import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import ImageDetailTab from './ImageDetailTab';
import ImageVersionTab from './ImageVersionsTab';
import ImagePackagesTab from './ImagePackagesTab';
import PropTypes from 'prop-types';

const ImageDetailTabs = ({ imageData, openUpdateWizard, imageVersion }) => {
  const [activeTabKey, setActiveTabkey] = useState(0);
  const handleTabClick = (_event, tabIndex) => setActiveTabkey(tabIndex);

  return (
    <div className="edge-c-device--detail add-100vh">
      <Tabs
        className="pf-u-ml-md"
        activeKey={activeTabKey}
        onSelect={handleTabClick}
      >
        <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
          <ImageDetailTab imageData={imageData} imageVersion={imageVersion} />
        </Tab>
        {imageVersion ? (
          <Tab eventKey={1} title={<TabTitleText>Packages</TabTitleText>}>
            <ImagePackagesTab imageVersion={imageVersion} />
          </Tab>
        ) : (
          <Tab eventKey={1} title={<TabTitleText>Versions</TabTitleText>}>
            <ImageVersionTab
              imageData={imageData}
              openUpdateWizard={openUpdateWizard}
            />
          </Tab>
        )}
      </Tabs>
    </div>
  );
};

ImageDetailTabs.propTypes = {
  imageData: PropTypes.object,
  imageVersion: PropTypes.object,
  openUpdateWizard: PropTypes.func,
};

export default ImageDetailTabs;
