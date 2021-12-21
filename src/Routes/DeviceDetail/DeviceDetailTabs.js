import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import { AppInfo } from '@redhat-cloud-services/frontend-components/Inventory';
import VulnerabilityTab from './Vulnerability';
import PropTypes from 'prop-types';

const DeviceDetailTabs = ({ imageId }) => {
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
          <VulnerabilityTab imageId={imageId} />
        </Tab>
      </Tabs>
    </div>
  );
};

DeviceDetailTabs.propTypes = {
  imageId: PropTypes.string,
};

export default DeviceDetailTabs;
