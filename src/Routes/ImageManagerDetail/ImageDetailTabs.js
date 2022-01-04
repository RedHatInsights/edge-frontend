import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TabTitleText, Skeleton } from '@patternfly/react-core';
import { useHistory, useLocation } from 'react-router-dom';

import ImageDetailTab from './ImageDetailTab';
import ImageVersionTab from './ImageVersionsTab';
import ImagePackagesTab from './ImagePackagesTab';
import PropTypes from 'prop-types';

// conditional render for same index
const tabs = {
  details: 0,
  packages: 1,
  versions: 1,
};

const ImageDetailTabs = ({
  imageData,
  openUpdateWizard,
  imageVersion,
  isLoading,
}) => {
  const location = useLocation();
  const history = useHistory();
  const [activeTabKey, setActiveTabkey] = useState(tabs.details);

  const paramIndex = imageVersion ? 4 : 3;
  const url = location.pathname.split('/');

  const handleTabClick = (_event, tabIndex) => {
    const selectedTab =
      tabIndex === 0 ? 'details' : imageVersion ? 'packages' : 'versions';

    url[paramIndex] = selectedTab;
    history.push(url.join('/'));

    setActiveTabkey(tabIndex);
  };

  useEffect(() => {
    if (paramIndex > url.length - 1) {
      setActiveTabkey(tabs.details);
      return;
    }
    const lowerTab = url[paramIndex].toLowerCase();
    setActiveTabkey(tabs[lowerTab] || tabs.details);
  }, [imageVersion]);

  return (
    <div className="edge-c-device--detail add-100vh">
      <Tabs
        className="pf-u-ml-md"
        activeKey={activeTabKey}
        onSelect={handleTabClick}
      >
        <Tab
          eventKey={tabs.details}
          title={<TabTitleText>Details</TabTitleText>}
        >
          <ImageDetailTab imageData={imageData} imageVersion={imageVersion} />
        </Tab>
        {isLoading ? (
          <Tab
            title={
              <TabTitleText>
                {' '}
                <Skeleton width="75px" />
              </TabTitleText>
            }
          ></Tab>
        ) : imageVersion ? (
          <Tab
            eventKey={tabs.packages}
            title={<TabTitleText>Packages</TabTitleText>}
          >
            <ImagePackagesTab imageVersion={imageVersion} />
          </Tab>
        ) : (
          <Tab
            eventKey={tabs.versions}
            title={<TabTitleText>Versions</TabTitleText>}
          >
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
  isLoading: PropTypes.bool,
};

export default ImageDetailTabs;
