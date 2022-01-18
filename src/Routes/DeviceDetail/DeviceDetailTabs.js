import React, { useEffect, useState } from 'react';
import { Tabs, Tab, TabTitleText, Alert, Button } from '@patternfly/react-core';
import { AppInfo } from '@redhat-cloud-services/frontend-components/Inventory';
import VulnerabilityTab from './Vulnerability';
import PropTypes from 'prop-types';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { InProgressIcon } from '@patternfly/react-icons';
import UpdateImageModal from './UpdateImageModal';

const DeviceDetailTabs = ({ systemProfile, imageId, setUpdateModal }) => {
  const [updateCveModal, setUpdateCveModal] = useState({
    isOpen: false,
    imageId: null,
    cveCount: 0,
  });
  const [activeTabKey, setActiveTabkey] = useState(0);
  const [CVEs, setCVEs] = useState(null);
  const [activeAlert, setActiveAlert] = useState('noAlert');
  const handleTabClick = (_event, tabIndex) => setActiveTabkey(tabIndex);

  useEffect(() => {
    setUpdateCveModal((prevState) => ({ ...prevState, imageId: imageId }));
  }, [imageId]);

  useEffect(() => {
    !CVEs?.isLoading &&
      !CVEs?.meta?.filter &&
      setUpdateCveModal((prevState) => ({
        ...prevState,
        cveCount: CVEs?.data?.length,
      }));

    if (
      CVEs?.isLoading ||
      CVEs?.meta?.filter ||
      !systemProfile?.system_profile
    ) {
      return;
    } else if (!CVEs?.data?.length > 0) {
      setActiveAlert('noAlert');
    } else if (
      systemProfile?.system_profile?.status === 'BUILDING' ||
      systemProfile?.system_profile?.status === 'CREADTED'
    ) {
      setActiveAlert('systemUpdating');
    } else if (
      systemProfile?.system_profile?.image_data?.ImageInfo?.UpdatesAvailable
        ?.length > 0
    ) {
      setActiveAlert('updateDevice');
    } else if (
      systemProfile?.system_profile?.image_data?.ImageInfo?.Image?.Status ===
      'BUILDING'
    ) {
      setActiveAlert('imageBuilding');
    } else {
      setActiveAlert('updateImage');
    }
  }, [CVEs, systemProfile]);

  const handleUpdateImageButton = () => {
    setUpdateCveModal((preState) => ({
      ...preState,
      isOpen: true,
    }));
  };

  const handleUpdateDeviceButton = () => {
    setUpdateModal((preState) => ({
      ...preState,
      isOpen: true,
    }));
  };

  const alerts = {
    updateImage: (
      <Alert
        className="pf-u-mb-md"
        variant="info"
        isInline
        title="To remediate CVEs, update the image."
        actionLinks={
          <Button
            className="pf-u-mt-sm"
            isSmall
            onClick={handleUpdateImageButton}
          >
            Update Image
          </Button>
        }
      />
    ),
    imageBuilding: (
      <Alert
        className="pf-u-mb-md"
        customIcon={<InProgressIcon />}
        variant="info"
        isInline
        title="Image build in progress. Once completed, you'll need to update your device."
      />
    ),
    updateDevice: (
      <Alert
        className="pf-u-mb-md"
        variant="warning"
        isInline
        title=" Image build completed. Update device to the newest image version to remediate CVEs."
        actionLinks={
          <Button
            className="pf-u-mt-sm"
            isSmall
            onClick={handleUpdateDeviceButton}
          >
            Update Device
          </Button>
        }
      />
    ),
    systemUpdating: (
      <Alert
        className="pf-u-mb-md"
        customIcon={<InProgressIcon />}
        variant="info"
        isInline
        title="Device updating. No additional actions required."
      />
    ),
    noAlert: <></>,
  };

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
          <Main>
            {alerts[activeAlert]}
            <VulnerabilityTab setCVEs={setCVEs} />
          </Main>
        </Tab>
      </Tabs>
      {updateCveModal.isOpen && (
        <UpdateImageModal
          updateCveModal={updateCveModal}
          setUpdateCveModal={setUpdateCveModal}
        />
      )}
    </div>
  );
};

DeviceDetailTabs.propTypes = {
  imageId: PropTypes.string,
  systemProfile: PropTypes.object,
  setUpdateModal: PropTypes.func,
};

export default DeviceDetailTabs;
