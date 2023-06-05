import React, { useState, useEffect } from 'react';
import { Tabs, Tab, TabTitleText, Skeleton } from '@patternfly/react-core';
import { useHistory, useLocation, useNavigate } from 'react-router-dom';
import { routes as paths } from '../../constants/routeMapper';

import ImageDetailTab from './ImageDetailTab';
import ImageVersionTab from './ImageVersionsTab';
import ImagePackagesTab from './ImagePackagesTab';
import PropTypes from 'prop-types';
import EmptyState from '../../components/Empty';

import { mapUrlToObj } from '../../utils';
import { restorePrefixURL } from './utils';

// conditional render for same index
const tabs = {
  details: 0,
  packages: 1,
  versions: 1,
};

const ImageDetailTabs = ({
  pathPrefix,
  urlName,
  historyProp,
  locationProp,
  navigateProp,
  imageData,
  openUpdateWizard,
  imageVersion,
  isLoading,
}) => {
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const { pathname } = locationProp ? locationProp() : useLocation();
  let currentPathName = pathname;
  if (pathPrefix && pathname.startsWith(pathPrefix)) {
    // remove the prefix from pathname
    currentPathName = pathname.slice(pathPrefix.length);
  }

  const navigate = navigateProp
    ? navigateProp()
    : useNavigate
    ? useNavigate()
    : null;
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
  const imageUrlMapper = mapUrlToObj(currentPathName, keys);

  const handleTabClick = (_event, tabIndex) => {
    const selectedTab =
      tabIndex === 0 ? 'details' : imageVersion ? 'packages' : 'versions';

    imageUrlMapper[activeTab] = selectedTab;

    const url = restorePrefixURL(imageUrlMapper.buildUrl(), pathPrefix);

    if (navigateProp) {
      navigate(url);
    } else {
      history.push(url);
    }

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
                pathPrefix={pathPrefix}
                urlName={urlName}
                historyProp={historyProp}
                navigateProp={navigateProp}
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
                <ImagePackagesTab
                  pathPrefix={pathPrefix}
                  urlName={urlName}
                  navigateProp={navigateProp}
                  historyProp={historyProp}
                  locationProp={locationProp}
                  imageVersion={imageVersion}
                />
              </Tab>
            ) : (
              <Tab
                eventKey={tabs.versions}
                title={<TabTitleText>Versions</TabTitleText>}
              >
                <ImageVersionTab
                  pathPrefix={pathPrefix}
                  urlName={urlName}
                  navigateProp={navigateProp}
                  historyProp={historyProp}
                  locationProp={locationProp}
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
  pathPrefix: PropTypes.string,
  urlName: PropTypes.string,
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
  imageData: PropTypes.object,
  imageVersion: PropTypes.object,
  openUpdateWizard: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default ImageDetailTabs;
