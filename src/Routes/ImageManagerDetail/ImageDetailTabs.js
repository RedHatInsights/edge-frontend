import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TabTitleText, Skeleton } from '@patternfly/react-core';
import { useHistory, useLocation } from 'react-router-dom';
import { routes as paths } from '../../constants/routeMapper';

import ImageDetailTab from './ImageDetailTab';
import ImageVersionTab from './ImageVersionsTab';
import ImagePackagesTab from './ImagePackagesTab';
import PropTypes from 'prop-types';
import EmptyState from '../../components/Empty';

import { mapUrlToObj } from '../../utils';

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
  const history = useHistory();
  const { pathname } = useLocation();
  const [activeTabKey, setActiveTabkey] = useState(tabs.details);
  const activeTab = imageVersion ? 'imageTab' : 'imageSetTab';

  const keys = [
    'baseURL',
    'imageSetVersion',
    'imageSetTab',
    'imageVersion',
    'imageTab',
    'packagesToggle',
  ];
  const imageUrlMapper = mapUrlToObj(pathname, keys);

  const handleTabClick = (_event, tabIndex) => {
    const selectedTab =
      tabIndex === 0 ? 'details' : imageVersion ? 'packages' : 'versions';

    imageUrlMapper[activeTab] = selectedTab;

    history.push(imageUrlMapper.buildUrl());

    setActiveTabkey(tabIndex);
  };

  useEffect(() => {
    imageUrlMapper['imageTab']
      ? setActiveTabkey(tabs[imageUrlMapper['imageTab']])
      : setActiveTabkey(tabs[imageUrlMapper['imageSetTab']]);
  }, [pathname]);

  return (
    <>
      {!imageData.isLoading && imageData.hasError ? (
        <EmptyState
          icon="question"
          title="Image not found"
          body="Please check you have the correct link with the correct image Id."
          primaryAction={{
            text: 'Back to Manage Images',
            href: paths.manageImages,
          }}
          secondaryActions={[]}
        />
      ) : (
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
              <ImageDetailTab
                imageData={imageData}
                imageVersion={imageVersion}
              />
            </Tab>
            {isLoading ? (
              <Tab
                title={
                  <TabTitleText>
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
      )}
    </>
  );
};

ImageDetailTabs.propTypes = {
  imageData: PropTypes.object,
  imageVersion: PropTypes.object,
  openUpdateWizard: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default ImageDetailTabs;
