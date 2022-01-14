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

  const paramIndex = imageVersion ? 5 : 3;
  const splitUrl = location.pathname.split('/');

  const handleTabClick = (_event, tabIndex) => {
    const selectedTab =
      tabIndex === 0 ? 'details' : imageVersion ? 'packages' : 'versions';

    splitUrl[paramIndex] = selectedTab;

    if (selectedTab === 'details') {
      history.push(splitUrl.splice(0, 6).join('/'));
    } else {
      history.push(splitUrl.join('/'));
    }

    setActiveTabkey(tabIndex);
  };

  useEffect(() => {
    tabs[splitUrl[3]] !== activeTabKey && setActiveTabkey(tabs[splitUrl[4]]);
  }, [splitUrl]);

  useEffect(() => {
    if (paramIndex > splitUrl.length - 1) {
      setActiveTabkey(tabs.details);
      return;
    }
    const lowerTab = splitUrl[paramIndex].toLowerCase();
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
