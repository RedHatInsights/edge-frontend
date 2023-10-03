import React, { useState } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Divider,
  Page,
  PageSection,
  Skeleton,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { getDeviceUpdates, updateSystem } from '../../api/devices';
import { distributionMapper } from '../../constants';
import { useDispatch } from 'react-redux';
import { routes as paths } from '../../constants/routeMapper';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
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
  headerCol,
} from '@patternfly/react-table';
import {
  useParams,
  useHistory,
  useLocation,
  useNavigate,
  matchPath,
} from 'react-router-dom';
import apiWithToast from '../../utils/apiWithToast';
import { createLink } from '../../utils';

const filters = [
  { label: 'Version', type: 'text' },
  { label: 'Release', type: 'text' },
  { label: 'Additional packages', type: 'text' },
  { label: 'All packages', type: 'text' },
  { label: 'Systems running', type: 'text' },
  { label: 'Created', type: 'text' },
];

const columns = [
  {
    title: 'Version',
    cellTransforms: [headerCol('selectable-radio')],
  },
  { title: 'Release' },
  { title: 'Additional packages' },
  { title: 'All packages' },
  { title: 'Systems running' },
  { title: 'Created' },
];

const CurrentVersion = ({ image }) => {
  const current_version = [
    {
      version: image.cells[0],
      release: image.cells[1],
      additionalPackages: image.cells[2],
      allPackages: image.cells[3],
      systemsRunning: image.cells[4],
      created: image.cells[5],
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
          {current_version.map((version, index) => (
            <Tr key={index}>
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

const UpdateSystemMain = ({
  data,
  fetchDevices,
  isLoading,
  hasError,
  historyProp,
  navigateProp,
  locationProp,
  currentId,
  notificationProp,
}) => {
  const device = data?.Device;
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedCommitID, setSelectedCommitID] = useState(null);
  const [isUpdateSubmitted, setIsUpdateSubmitted] = useState(false);
  const dispatch = useDispatch();
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const navigate = navigateProp
    ? navigateProp()
    : useNavigate
    ? useNavigate()
    : null;
  const { pathname, search } = locationProp ? locationProp() : useLocation();
  const setUpdateEvent = (value) => {
    setSelectedVersion(value.cells[0]);
    setSelectedCommitID(value);
  };

  const handleUpdateEvent = async () => {
    setIsUpdateSubmitted(true);
    const statusMessages = {
      onInfo: {
        title: 'Updating system',
        description: ` ${selectedCommitID.deviceName} was added to the queue.`,
      },
      onError: {
        title: 'Error',
        description: `Failed to update the selected system(s)`,
      },
    };

    await apiWithToast(
      dispatch,
      () =>
        updateSystem({
          CommitID: selectedCommitID.commitID,
          DevicesUUID: [selectedCommitID.deviceUUID],
        }),
      statusMessages,
      notificationProp
    );

    handleClose();
    setIsUpdateSubmitted(false);
  };

  const handleClose = () => {
    // Return either to the system detail, group detail, or inventory page,
    // depending on path and from_details param
    let destPath = paths.inventory;
    const matchInventoryDetailUpdate = matchPath(pathname, {
      path: paths.inventoryDetailUpdate,
      exact: true,
      strict: false,
    });

    const matchInsightsInventoryDetailUpdate = matchPath(pathname, {
      path: paths.insightsInventoryDetailUpdate,
      exact: true,
      strict: false,
    });
    const matchInventoryDetail = matchPath(`/inventory/${currentId}`, {
      path: paths.inventoryDetail,
      exact: true,
      strict: false,
    });
    if (pathname === matchInventoryDetailUpdate?.url) {
      destPath = search.includes('from_details=true')
        ? matchInventoryDetail.url
        : paths.inventory;
    }
    if (pathname === matchInsightsInventoryDetailUpdate?.url) {
      destPath = search.includes('from_details=true')
        ? `/insights${matchInventoryDetail.url}`
        : paths.insightsInventory;
    }
    if (pathname === paths.fleetManagementSystemDetailUpdate) {
      destPath = search.includes('from_details=true')
        ? paths.fleetManagementSystemDetail
        : paths.fleetManagementDetail;
    }

    // Construct destination path
    const pathLen = destPath.split('/').length;
    const dest = pathname.split('/').slice(0, pathLen).join('/');
    if (navigateProp) {
      navigate({ pathname: dest });
    } else {
      history.push({ pathname: dest });
    }
  };

  const buildRow = (image) => {
    const version = image?.Version;
    const release = distributionMapper[image?.Distribution];
    const additionalPackages = image?.Packages?.length || 0;
    const allPackages = image?.TotalPackages;
    const systemsRunning = image?.SystemsRunning;
    const created = (
      <span>
        <DateFormat type="relative" date={image?.CreatedAt} />
      </span>
    );
    const commitID = image?.CommitID;
    const deviceUUID = device?.UUID;
    const deviceName = device?.DeviceName;
    return {
      cells: [
        version,
        release,
        additionalPackages,
        allPackages,
        systemsRunning,
        created,
      ],
      commitID,
      deviceUUID,
      deviceName,
      selected: selectedVersion === version,
    };
  };
  const currentImage = buildRow(data?.ImageInfo?.Image);
  const newImages = data?.ImageInfo?.UpdatesAvailable?.map((update) =>
    buildRow(update?.Image)
  );

  return (
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
            <>
              <GeneralTable
                historyProp={historyProp}
                navigateProp={navigateProp}
                locationProp={locationProp}
                className="pf-u-mt-sm"
                apiFilterSort={true}
                isUseApi={true}
                loadTableData={fetchDevices}
                filters={filters}
                tableData={{
                  count: data?.ImageInfo?.Count,
                  isLoading,
                  hasError,
                }}
                columnNames={columns}
                rows={newImages}
                defaultSort={{ index: 0, direction: 'desc' }}
                hasRadio={true}
                setRadioSelection={setUpdateEvent}
                isFooterFixed={true}
              />
              <div
                style={{
                  background: 'white',
                  left: '200px',
                  position: 'fixed',
                  height: '90px',
                  width: '100%',
                  bottom: '0px',
                  paddingLeft: '80px',
                  paddingBottom: '0px',
                }}
              >
                <Divider
                  style={{
                    paddingBottom: '25px',
                    width: '100%',
                    paddingLeft: 0,
                  }}
                />

                <Button
                  style={{ left: '60px' }}
                  key="confirm"
                  variant="primary"
                  isDisabled={!selectedVersion || isUpdateSubmitted}
                  onClick={() => handleUpdateEvent()}
                >
                  Update system
                </Button>
                <Button
                  style={{ left: '70px' }}
                  key="cancel"
                  variant="link"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </div>
            </>
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};

UpdateSystemMain.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  historyProp: PropTypes.func,
  navigateProp: PropTypes.func,
  locationProp: PropTypes.func,
  routeMatchProp: PropTypes.func,
  fetchDevices: PropTypes.func,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  currentId: PropTypes.string,
  notificationProp: PropTypes.object,
};

const UpdateSystem = ({
  inventoryId,
  historyProp,
  navigateProp,
  locationProp,
  routeMatchProp,
  paramsProp,
  notificationProp,
}) => {
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const { deviceId, groupId } = paramsProp
    ? paramsProp()
    : useParams
    ? useParams()
    : null;
  const currentId = inventoryId ? inventoryId : deviceId;
  const currentInventoryPath =
    window.location.pathname.indexOf('edge') > 0 ? 'edge' : paths.inventory;
  const [{ data, isLoading, hasError }, fetchDevices] = useApi({
    api: getDeviceUpdates,
    id: currentId,
    tableReload: true,
  });

  const device = data?.Device;
  const groupName = groupId
    ? device?.DevicesGroups?.find((group) => group.ID.toString() === groupId)
        ?.Name
    : null;

  return (
    <>
      <PageHeader className="pf-m-light">
        {!groupName ? (
          <Breadcrumb ouiaId="systems-list">
            <BreadcrumbItem>
              {createLink({
                pathname:
                  currentInventoryPath === 'edge'
                    ? `${currentInventoryPath}/inventory`
                    : `insights${currentInventoryPath}/manage-edge-inventory`,
                linkText: 'Systems',
                history,
              })}
            </BreadcrumbItem>
            <BreadcrumbItem>
              {createLink({
                pathname:
                  currentInventoryPath === 'edge'
                    ? `${currentInventoryPath}/inventory/${currentId}/`
                    : `insights${currentInventoryPath}/${currentId}`,
                linkText: device?.DeviceName || <Skeleton width="100px" />,
                history,
              })}
            </BreadcrumbItem>
            <BreadcrumbItem>Update</BreadcrumbItem>
          </Breadcrumb>
        ) : (
          <Breadcrumb ouiaId="groups-list">
            <BreadcrumbItem>
              {createLink({
                pathname: paths.fleetManagement,
                linkText: 'Groups',
                history,
              })}
            </BreadcrumbItem>
            <BreadcrumbItem>
              {createLink({
                pathname: `${paths.fleetManagement}/${groupId}`,
                linkText: groupName || <Skeleton width="100px" />,
                history,
              })}
            </BreadcrumbItem>
            <BreadcrumbItem>
              {createLink({
                pathname: `${paths.fleetManagement}/${groupId}/systems/${currentId}/`,
                linkText: device?.DeviceName,
                history,
              })}
            </BreadcrumbItem>
            <BreadcrumbItem>Update</BreadcrumbItem>
          </Breadcrumb>
        )}
        <PageHeaderTitle title="Update" />
        <TextContent className="pf-u-mt-md">
          {device?.DeviceName ? (
            <Text>
              {'Update '}
              <strong>{device?.DeviceName}</strong>
              {' to a newer version of '}
              <strong>{data?.ImageInfo?.Image?.Name}</strong>
              {' by selecting a new version from the table below.'}
            </Text>
          ) : (
            <Skeleton width="100px" />
          )}
        </TextContent>
      </PageHeader>
      <section className="edge-devices pf-l-page__main-section pf-c-page__main-section">
        <UpdateSystemMain
          data={data}
          currentId={currentId}
          fetchDevices={fetchDevices}
          isLoading={isLoading}
          hasError={hasError}
          navigateProp={navigateProp}
          histor
          yProp={historyProp}
          locationProp={locationProp}
          routeMatchProp={routeMatchProp}
          notificationProp={notificationProp}
        />
      </section>
    </>
  );
};

UpdateSystem.propTypes = {
  historyProp: PropTypes.func,
  navigateProp: PropTypes.func,
  locationProp: PropTypes.func,
  routeMatchProp: PropTypes.func,
  paramsProp: PropTypes.func,
  inventoryId: PropTypes.string,
  notificationProp: PropTypes.object,
};

export default UpdateSystem;
