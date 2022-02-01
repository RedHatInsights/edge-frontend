import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';
import { AppInfo } from '@redhat-cloud-services/frontend-components/Inventory';
import VulnerabilityTab from './Vulnerability';
import PropTypes from 'prop-types';

const DeviceDetailTabs = ({
  systemProfile,
  imageId,
  setUpdateModal,
  setReload,
}) => {
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
          <AppInfo showTags fallback="" />
        </Tab>
        <Tab eventKey={1} title={<TabTitleText>Vulnerability</TabTitleText>}>
          <VulnerabilityTab
            systemProfile={systemProfile}
            setUpdateModal={setUpdateModal}
            imageId={imageId}
            setReload={setReload}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

DeviceDetailTabs.propTypes = {
  imageId: PropTypes.string,
  systemProfile: PropTypes.object,
  setUpdateModal: PropTypes.func,
  setReload: PropTypes.bool,
};

export default DeviceDetailTabs;
