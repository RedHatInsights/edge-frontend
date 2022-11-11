import React from 'react';
import PropTypes from 'prop-types';
import {
  Page,
  PageSection,
  Text,
  TextContent,
  Title,
  Card,
  CardBody,
  Bullseye,
  Spinner,
  Backdrop,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import UpdateVersionTable from './UpdateVersionTable';
import { getDeviceHasUpdate } from '../../api/devices';
import { distributionMapper } from '../../constants';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import useApi from '../../hooks/useApi';

const CurrentVersion = ({ image }) => {
  const fields = [
    {
      label: 'Version',
      value: image?.version,
      width: '180px',
      right: '10px',
    },
    {
      label: 'Release',
      value: image?.release,
      width: '190px',
      right: '10px',
    },
    {
      label: 'Additional packages',
      value: image?.additionalPackages,
      width: '180px',
      right: '15px',
    },
    {
      label: 'All packages',
      value: image?.allPackages,
      width: '180px',
      right: '25px',
    },
    {
      label: 'Systems running',
      value: image?.systemsRunning,
      width: '180px',
      right: '40px',
    },
    {
      label: 'Created',
      value: image?.created,
      width: 'max-content',
      right: '60px',
    },
  ];

  return (
    <>
      <TextContent>
        <Title headingLevel="h2">
          <Text>Current version</Text>
        </Title>
      </TextContent>
      <Grid className="pf-u-mt-sm" span={12} style={{ paddingLeft: '43px' }}>
        {fields.map(({ label, value, width, right }, index) => {
          return (
            <GridItem
              key={index}
              span={2}
              style={{
                width,
                padding: '8px',
                position: 'relative',
                right,
              }}
            >
              <Text className="pf-u-font-size-sm" component={'b'}>
                {label}
              </Text>
              <Text className="pf-u-mt-sm pf-u-font-size-sm">{value}</Text>
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
};

CurrentVersion.propTypes = {
  image: PropTypes.object,
};

const AllVersions = ({
  data,
  setUpdatePage,
  refreshTable,
  isLoading,
  hasError,
}) => (
  <>
    <TextContent>
      <Title headingLevel="h2">
        <Text className="pf-u-mt-md">Select version to update to</Text>
      </Title>
    </TextContent>
    <UpdateVersionTable
      setUpdatePage={setUpdatePage}
      data={data}
      refreshTable={refreshTable}
      isLoading={isLoading}
      hasError={hasError}
    />
  </>
);

AllVersions.propTypes = {
  data: PropTypes.array,
  setUpdatePage: PropTypes.func,
  refreshTable: PropTypes.func,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
};

const PageLayout = ({ children }) => (
  <Page>
    <PageSection isWidthLimited>
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </PageSection>
  </Page>
);

PageLayout.propTypes = {
  children: PropTypes.any,
};

const UpdateSystem = ({ setUpdatePage, systemId, refreshTable }) => {
  const [{ data, isLoading, hasError }] = useApi({
    api: () => getDeviceHasUpdate(systemId),
    tableReload: false,
  });

  const buildRow = (image) => ({
    version: image?.Version,
    release: distributionMapper[image?.Distribution],
    additionalPackages: image?.Packages?.length || 0,
    allPackages: image?.TotalPackages,
    systemsRunning: image?.SystemsRunning,
    created: (
      <span>
        <DateFormat type="relative" date={image?.CreatedAt} />
      </span>
    ),
    commitID: image?.CommitID,
    deviceUUID: data?.Device?.UUID,
    deviceName: data?.Device?.DeviceName,
  });

  const currentImage = buildRow(data?.ImageInfo?.Image);
  const newImages = data?.ImageInfo?.UpdatesAvailable?.map((update) =>
    buildRow(update?.Image)
  );

  return data ? (
    <PageLayout>
      <CurrentVersion image={currentImage} />
      <AllVersions
        data={newImages}
        setUpdatePage={setUpdatePage}
        refreshTable={refreshTable}
        isLoading={isLoading}
        hasError={hasError}
      />
    </PageLayout>
  ) : (
    <Backdrop>
      <Bullseye>
        <Spinner isSVG diameter="100px" />
      </Bullseye>
    </Backdrop>
  );
};

UpdateSystem.propTypes = {
  setUpdatePage: PropTypes.func,
  systemId: PropTypes.string,
  refreshTable: PropTypes.func,
};

export default UpdateSystem;
