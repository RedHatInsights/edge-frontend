import React from 'react';
import PropTypes from 'prop-types';
import {
  Backdrop,
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  Card,
  CardBody,
  Page,
  PageSection,
  Spinner,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import UpdateVersionTable from './UpdateVersionTable';
import { getDevice } from '../../api/devices';
import { distributionMapper } from '../../constants';
import { routes as paths } from '../../constants/routeMapper';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useApi from '../../hooks/useApi';
import {
  TableComposable,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@patternfly/react-table';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

const CurrentVersion = ({ image }) => {
  const current_version = [
    {
      version: image?.version,
      release: image?.release,
      additionalPackages: image?.additionalPackages,
      allPackages: image?.allPackages,
      systemsRunning: image?.systemsRunning,
      created: image?.created,
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
};

const UpdateSystemMain = ({ data }) => {
  const device = data?.Device;

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
    deviceUUID: device?.UUID,
    deviceName: device?.DeviceName,
  });

  const currentImage = buildRow(data?.ImageInfo?.Image);
  const newImages = data?.ImageInfo?.UpdatesAvailable?.map((update) =>
    buildRow(update?.Image)
  );

  return device ? (
    <Page>
      <PageSection isWidthLimited>
        <Card>
          <CardBody>
            <CurrentVersion image={currentImage} />
            <TextContent>
              <Title headingLevel="h2">
                <Text className="pf-u-mt-md">Select version to update to</Text>
              </Title>
            </TextContent>
            <UpdateVersionTable data={newImages} />
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  ) : (
    <Backdrop>
      <Bullseye>
        <Spinner isSVG diameter="100px" />
      </Bullseye>
    </Backdrop>
  );
};

UpdateSystemMain.propTypes = {
  data: PropTypes.object,
};

const UpdateSystem = () => {
  const { deviceId, groupId } = useParams();
  const [{ data, isLoading }] = useApi({
    api: () => getDevice(deviceId),
  });
  const device = data?.Device;
  const groupName = groupId
    ? device?.DevicesGroups?.find((group) => group.ID.toString() === groupId)
        ?.Name
    : null;

  return isLoading ? (
    <Backdrop>
      <Bullseye>
        <Spinner isSVG diameter="100px" />
      </Bullseye>
    </Backdrop>
  ) : (
    <>
      <PageHeader className="pf-m-light">
        {!groupName ? (
          <Breadcrumb ouiaId="systems-list">
            <BreadcrumbItem>
              <Link to={paths['inventory']}>Systems</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`${paths['inventory']}/${deviceId}/`}>
                {device?.DeviceName}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Update</BreadcrumbItem>
          </Breadcrumb>
        ) : (
          <Breadcrumb ouiaId="groups-list">
            <BreadcrumbItem>
              <Link to={`${paths['fleet-management']}`}>Groups</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`${paths['fleet-management']}/${groupId}`}>
                {groupName}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link
                to={`${paths['fleet-management']}/${groupId}/systems/${deviceId}/`}
              >
                {device?.DeviceName}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem>Update</BreadcrumbItem>
          </Breadcrumb>
        )}
        <PageHeaderTitle title="Update" />
        <TextContent className="pf-u-mt-md">
          <Text>
            {'Update '}
            <strong>{device?.DeviceName}</strong>
            {' to a newer version of '}
            <strong>{device?.ImageName}</strong>
            {' by selecting a new version from the table below.'}
          </Text>
        </TextContent>
      </PageHeader>
      <Main className="edge-devices">
        <UpdateSystemMain data={data} />
      </Main>
    </>
  );
};

export default UpdateSystem;
