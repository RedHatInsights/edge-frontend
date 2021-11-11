import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import { AppInfo } from '@redhat-cloud-services/frontend-components/Inventory';
import VulnerabilityTab from './Vulnerability';

const DeviceDetailTabs = () => {
  const [activeTabKey, setActiveTabkey] = useState(0);
  const handleTabClick = (_event, tabIndex) => setActiveTabkey(tabIndex);
  return (
    <div className="edge-c-device--detail add-100vh">
      <Tabs
        className="pf-u-ml-md pf-u-mb-md"
        activeKey={activeTabKey}
        onSelect={handleTabClick}
      >
        <Tab eventKey={0} title={<TabTitleText>Details</TabTitleText>}>
          <AppInfo showTags fallback="" />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Vulnerability</TabTitleText>}>
          <VulnerabilityTab />
        </Tab>
      </Tabs>
    </div>
  );
};

export default DeviceDetailTabs;
