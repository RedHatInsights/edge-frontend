import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import ImageDetailTab from './ImageDetailTab';
import ImagePackagesTab from './ImagePackagesTab';

const ImageDetailTabs = () => {
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
          <ImageDetailTab />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Versions</TabTitleText>}>
          <ImagePackagesTab />
        </Tab>
      </Tabs>
    </div>
  );
};

export default ImageDetailTabs;
