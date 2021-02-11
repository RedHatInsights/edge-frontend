import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
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

const DeviceDetail = () => {
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
        getRegistry().register(mergeWithDetail(deviceDetail));
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
      <Main>
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
