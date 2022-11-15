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
  Skeleton,
} from '@patternfly/react-core';
import UpdateVersionTable from './UpdateVersionTable';
import { getDeviceHasUpdate } from '../../api/devices';
import { distributionMapper } from '../../constants';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import useApi from '../../hooks/useApi';
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';

const CurrentVersion = ({ image, isLoading }) => {
  const current_version = [
    {
      version: isLoading ? <Skeleton width="100%" /> : image?.version,
      release: isLoading ? <Skeleton width="100%" /> : image?.release,
      additionalPackages: isLoading ? (
        <Skeleton width="100%" />
      ) : (
        image?.additionalPackages
      ),
      allPackages: isLoading ? <Skeleton width="100%" /> : image?.allPackages,
      systemsRunning: isLoading ? (
        <Skeleton width="100%" />
      ) : (
        image?.systemsRunning
      ),
      created: isLoading ? <Skeleton width="100%" /> : image?.created,
    },
  ];
  const columnNames = {
    version: 'Version',
    release: 'Release',
    additionalPackages: 'Additional packages',
    allPackages: 'All packages',
    systemsRunning: 'Systems running',
    created: 'Created',
  };

  return (
    <>
      <TextContent>
        <Title headingLevel="h2">
          <Text>Current version</Text>
        </Title>
      </TextContent>
      <TableComposable
        aria-label="Current version table"
        variant={'compact'}
        borders={false}
      >
        <Thead>
          <Tr style={{ borderBottomStyle: 'hidden' }}>
            <Th style={{ width: '3%' }}></Th>
            <Th>{columnNames.version}</Th>
            <Th>{columnNames.release}</Th>
            <Th>{columnNames.additionalPackages}</Th>
            <Th>{columnNames.allPackages}</Th>
            <Th>{columnNames.systemsRunning}</Th>
            <Th>{columnNames.created}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {current_version.map((version) => (
            <Tr key={version.version}>
              <Td></Td>
              <Td dataLabel={columnNames.version}>{version.version}</Td>
              <Td dataLabel={columnNames.release}>{version.release}</Td>
              <Td dataLabel={columnNames.additionalPackages}>
                {version.additionalPackages}
              </Td>
              <Td dataLabel={columnNames.allPackages}>{version.allPackages}</Td>
              <Td dataLabel={columnNames.systemsRunning}>
                {version.systemsRunning}
              </Td>
              <Td dataLabel={columnNames.created}>{version.created}</Td>
            </Tr>
          ))}
        </Tbody>
      </TableComposable>
    </>
  );
};

CurrentVersion.propTypes = {
  image: PropTypes.object,
  isLoading: PropTypes.bool,
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
      <CurrentVersion image={currentImage} isLoading={isLoading} />
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
