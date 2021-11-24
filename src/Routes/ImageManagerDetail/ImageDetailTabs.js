import React, { useState } from 'react';
import { Tabs, Tab, TabTitleText } from '@patternfly/react-core';

import ImageDetailTab from './ImageDetailTab';
import ImageVersionTab from './ImageVersionsTab';
import ImagePackagesTab from './ImagePackagesTab';
import PropTypes from 'prop-types';

const ImageDetailTabs = ({
  imageData,
  urlParam,
  openUpdateWizard,
  isVersionDetails,
  imagePackageMetadata,
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
          <ImageDetailTab
            imageData={imageData}
            isVersionDetails={isVersionDetails || false}
            imagePackageMetadata={imagePackageMetadata}
          />
        </Tab>
        {isVersionDetails ? (
          <Tab eventKey={1} title={<TabTitleText>Packages</TabTitleText>}>
            <ImagePackagesTab
              imageData={imageData}
              urlParam={urlParam}
              openUpdateWizard={openUpdateWizard}
              imagePackageMetadata={imagePackageMetadata}
            />
          </Tab>
        ) : (
          <Tab eventKey={1} title={<TabTitleText>Versions</TabTitleText>}>
            <ImageVersionTab
              imageData={imageData}
              urlParam={urlParam}
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
  urlParam: PropTypes.string,
  openUpdateWizard: PropTypes.func,
  isVersionDetails: PropTypes.bool,
  imagePackageMetadata: PropTypes.object,
};

export default ImageDetailTabs;
