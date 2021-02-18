import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  InventoryDetailHead,
  AppInfo,
  DetailWrapper,
} from '@redhat-cloud-services/frontend-components/Inventory';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deviceDetail } from '../../store/deviceDetail';
import { RegistryContext } from '../../store';
import systemProfileStore from '@redhat-cloud-services/frontend-components-inventory-general-info/redux';

const DeviceDetail = () => {
  const { getRegistry } = useContext(RegistryContext);
  const { inventoryId, uuid } = useParams();
  const displayName = useSelector(
    ({ entityDetails }) => entityDetails?.entity?.display_name
  );
  const groupName = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.name
  );

  useEffect(() => {
    insights.chrome?.hideGlobalFilter?.(true);
    insights.chrome.appAction('system-detail');
  }, []);

  useEffect(() => {
    insights?.chrome?.appObjectId?.(inventoryId);
  }, [inventoryId]);

  return (
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
        <Breadcrumb ouiaId="systems-list">
          <BreadcrumbItem>
            <Link to={uuid ? `/groups` : '/devices'}>
              {uuid ? 'Groups' : 'Devices'}
            </Link>
          </BreadcrumbItem>
          {uuid && (
            <BreadcrumbItem>
              {groupName ? (
                <Link to={`/groups/${uuid}`}>{groupName}</Link>
              ) : (
                <Skeleton size={SkeletonSize.xs} />
              )}
            </BreadcrumbItem>
          )}
          <BreadcrumbItem isActive>
            <div className="ins-c-inventory__detail--breadcrumb-name">
              {displayName || <Skeleton size={SkeletonSize.xs} />}
            </div>
          </BreadcrumbItem>
        </Breadcrumb>
        <InventoryDetailHead fallback="" hideBack showTags hideInvDrawer />
      </PageHeader>
      <Main className="edge-c-device--detail">
        <Grid gutter="md">
          <GridItem span={12}>
            <AppInfo showTags fallback="" />
          </GridItem>
        </Grid>
      </Main>
    </DetailWrapper>
  );
};

export default DeviceDetail;
