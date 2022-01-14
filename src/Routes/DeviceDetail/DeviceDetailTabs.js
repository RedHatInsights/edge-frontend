import React, { useEffect, useState } from 'react';
import {
  Tabs,
  Tab,
  TabTitleText,
  Alert,
  AlertActionLink,
  Button,
} from '@patternfly/react-core';
import { AppInfo } from '@redhat-cloud-services/frontend-components/Inventory';
import VulnerabilityTab from './Vulnerability';
import PropTypes from 'prop-types';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { InProgressIcon } from '@patternfly/react-icons';
import UpdateImageModal from './UpdateImageModal';

const DeviceDetailTabs = ({ systemProfile, imageId }) => {
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
    console.log(CVEs);
    setUpdateCveModal((prevState) => ({ ...prevState, imageId: imageId }));
    !CVEs?.isLoading &&
      !CVEs?.meta?.filter &&
      setUpdateCveModal((prevState) => ({
        ...prevState,
        cveCount: CVEs?.data?.length,
      }));
    const status =
      systemProfile?.status === 'BUILDING' ||
      systemProfile?.status === 'CREADTED'
        ? 'Updating'
        : systemProfile?.image_data?.ImageInfo?.UpdatesAvailable?.length > 0
        ? 'Update Available'
        : systemProfile?.image_data?.ImageInfo?.Image?.Status === 'BUILDING'
        ? 'Updating Image'
        : 'Running';

    !CVEs?.isLoading &&
      !CVEs?.meta?.filter &&
      !CVEs?.data?.length > 0 &&
      setActiveAlert('noAlert');
    !CVEs?.isLoading &&
      !CVEs?.meta?.filter &&
      CVEs?.data?.length > 0 &&
      status === 'Running' &&
      setActiveAlert('updateImage');
    !CVEs?.isLoading &&
      !CVEs?.meta?.filter &&
      CVEs?.data?.length > 0 &&
      status === 'Updating Image' &&
      setActiveAlert('imageBuilding');
    !CVEs?.isLoading &&
      !CVEs?.meta?.filter &&
      CVEs?.data?.length > 0 &&
      status === 'Updating Available' &&
      setActiveAlert('updateDevice');
    !CVEs?.isLoading &&
      !CVEs?.meta?.filter &&
      CVEs?.data?.length > 0 &&
      status === 'Updating' &&
      setActiveAlert('systemUpdating');
  }, [CVEs]);

  const handleUpdateImageButton = () => {
    setUpdateCveModal((preState) => ({
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
        title="Update image to remediate CVEs."
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
        title="Image build in progress. When the image is done building, update the device to remdiate the CVEs."
      />
    ),
    updateDevice: (
      <Alert
        className="pf-u-mb-md"
        variant="warning"
        isInline
        title="Image update available. Update system to the newest image version to address CVEs associated with the current version"
        actionLinks={
          <Button className="pf-u-mt-sm" isSmall>
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
        title="System updating."
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
};

export default DeviceDetailTabs;
