import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import ImageDetailTab from './ImageDetailTab';

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
        <Tab eventKey={1} title={<TabTitleText>Packages</TabTitleText>}>
          Packages
        </Tab>
      </Tabs>
    </div>
  );
};

export default ImageDetailTabs;
