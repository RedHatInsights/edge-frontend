import React, { useState, useEffect, useContext, Suspense } from 'react';
import {
  Grid,
  GridItem,
  Breadcrumb,
  BreadcrumbItem,
  Bullseye,
  Spinner,
} from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  InventoryDetailHead,
  DetailWrapper,
} from '@redhat-cloud-services/frontend-components/Inventory';
import { useHistory, useLocation, useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deviceDetail } from '../../store/deviceDetail';
import { RegistryContext } from '../../store';
import DeviceDetailTabs from './DeviceDetailTabs';
import { getDevice, getInventory } from '../../api/devices';
import Status, { getDeviceStatus } from '../../components/Status';
import useApi from '../../hooks/useApi';
import RetryUpdatePopover from '../Devices/RetryUpdatePopover';
import { useLoadModule } from '@scalprum/react-core';
import { routes as paths } from '../../constants/routeMapper';

const UpdateDeviceModal = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateDeviceModal" */ '../Devices/UpdateDeviceModal'
  )
);

const DeviceDetail = () => {
  const [{ default: systemProfileStore }] = useLoadModule(
    {
      appName: 'inventory',
      scope: 'inventory',
      module: './systemProfileStore',
    },
    {}
  );
  const history = useHistory();
  const { pathname } = useLocation();
  const { deviceId, groupId } = useParams();
  const [imageId, setImageId] = useState(null);
  const { getRegistry } = useContext(RegistryContext);
  const entity = useSelector(({ entityDetails }) => entityDetails?.entity);

  const [imageData, setImageData] = useState();
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
  });
  const [isDeviceStatusLoading, setIsDeviceStatusLoading] = useState(true);
  const [reload, setReload] = useState(false);

  const [deviceData, fetchDeviceData] = useApi({
    api: () =>
      getInventory({
        query: {
          uuid: deviceId,
        },
      }),
  });

  const [deviceView] = deviceData.data?.data?.devices || [];
  const {
    Status: deviceViewStatus,
    UpdateAvailable: updateAvailable,
    DispatcherStatus: updateStatus,
    LastSeen: lastSeen,
    DeviceGroups: deviceGroups,
  } = deviceView || {};

  const groupName = groupId
    ? deviceGroups?.find((group) => group.ID.toString() === groupId)?.Name
    : null;

  const deviceStatus = getDeviceStatus(
    deviceViewStatus,
    updateAvailable,
    updateStatus
  );

  useEffect(() => {
    insights.chrome.registerModule('inventory');
    insights.chrome?.hideGlobalFilter?.(true);
    insights.chrome.appAction('system-detail');
  }, []);

  useEffect(() => {
    (async () => {
      if (!entity?.display_name) {
        return;
      }
      const image_data = await getDevice(deviceId);
      setImageData(image_data);
      setIsDeviceStatusLoading(false);
      setUpdateModal((prevState) => ({
        ...prevState,
        deviceData: [
          {
            display_name: entity.display_name,
            id: entity.id,
            deviceStatus: deviceStatus,
          },
        ],
        imageSetId: image_data?.ImageInfo?.Image?.ImageSetID,
      }));
      setImageId(image_data?.ImageInfo?.Image?.ID);
    })();
  }, [entity, reload]);

  return systemProfileStore ? (
    <DetailWrapper
      hideInvLink
      showTags
      onLoad={({ mergeWithDetail }) => {
        getRegistry().register({
          systemProfileStore,
          ...mergeWithDetail(deviceDetail),
        });
      }}
    >
      <PageHeader>
        {!groupName ? (
          <Breadcrumb ouiaId="systems-list">
            <BreadcrumbItem>
              <Link to={paths.inventory}>Systems</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>
              <div className="ins-c-inventory__detail--breadcrumb-name">
                {entity?.display_name || <Skeleton size={SkeletonSize.xs} />}
              </div>
            </BreadcrumbItem>
          </Breadcrumb>
        ) : (
          <Breadcrumb ouiaId="groups-list">
            <BreadcrumbItem>
              <Link to={paths.fleetManagement}>Groups</Link>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Link to={`${paths.fleetManagement}/${groupId}`}>
                {groupName}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbItem isActive>
              <div className="ins-c-inventory__detail--breadcrumb-name">
                {entity?.display_name || <Skeleton size={SkeletonSize.xs} />}
              </div>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
        <InventoryDetailHead
          fallback=""
          actions={[
            {
              title: 'Update',
              isDisabled:
                imageData?.UpdateTransactions?.[0]?.Status === 'BUILDING' ||
                imageData?.UpdateTransactions?.[0]?.Status === 'CREATED' ||
                !imageData?.ImageInfo?.UpdatesAvailable?.length > 0,
              onClick: () => {
                history.push({
                  pathname: `${pathname}/update`,
                  search: '?from_details=true',
                });
              },
            },
          ]}
          hideBack
          hideInvDrawer
          inventoryId={deviceId}
        />

        {isDeviceStatusLoading ? (
          <Skeleton size={SkeletonSize.xs} />
        ) : deviceStatus === 'error' || deviceStatus === 'unresponsive' ? (
          <RetryUpdatePopover
            lastSeen={lastSeen}
            device={deviceView}
            position={'right'}
            fetchDevices={fetchDeviceData}
          >
            <Status
              id={'device-status'}
              type={
                deviceStatus === 'error'
                  ? 'errorWithExclamationCircle'
                  : deviceStatus
              }
              isLink={true}
              isLabel={true}
              className="pf-u-mt-sm cursor-pointer"
            />
          </RetryUpdatePopover>
        ) : (
          <Status
            id={'device-status'}
            type={deviceStatus}
            isLabel={true}
            className="pf-u-mt-sm"
          />
        )}
      </PageHeader>
      <Grid gutter="md">
        <GridItem span={12}>
          <DeviceDetailTabs
            systemProfile={imageData}
            imageId={imageId}
            setUpdateModal={setUpdateModal}
            setReload={setReload}
          />
        </GridItem>
      </Grid>
      {updateModal.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateDeviceModal
            navigateBack={() => {
              history.push({ pathname });
              setUpdateModal((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
            refreshTable={() => setReload(true)}
          />
        </Suspense>
      )}
    </DetailWrapper>
  ) : (
    <Bullseye>
      <Spinner />
    </Bullseye>
  );
};

export default DeviceDetail;
