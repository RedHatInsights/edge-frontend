import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Grid, GridItem } from '@patternfly/react-core';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import {
  Skeleton,
  SkeletonSize,
  PageHeader,
  Main,
} from '@redhat-cloud-services/frontend-components';
import {
  InventoryDetailHead,
  AppInfo,
  DetailWrapper,
} from '@redhat-cloud-services/frontend-components/components/esm/Inventory';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

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
        getRegistry().register(mergeWithDetail());
      }}
    >
      <PageHeader>
        <Breadcrumb ouiaId="systems-list">
          <BreadcrumbItem>
            <Link to={`/groups`}>Groups</Link>
          </BreadcrumbItem>
          <BreadcrumbItem>
            {groupName ? (
              <Link to={`/groups/${uuid}`}>{groupName}</Link>
            ) : (
              <Skeleton size={SkeletonSize.xs} />
            )}
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            <div className="ins-c-inventory__detail--breadcrumb-name">
              {displayName || <Skeleton size={SkeletonSize.xs} />}
            </div>
          </BreadcrumbItem>
        </Breadcrumb>
        <InventoryDetailHead
          fallback=""
          hideBack
          showTags
          hideInvLink
          hideInvDrawer
        />
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
