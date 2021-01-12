import React, { Fragment, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PageHeader, Main } from '@redhat-cloud-services/frontend-components';
import {
  Breadcrumb,
  BreadcrumbItem,
  Skeleton,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import { routes } from '../../../package.json';
import { loadGroupsDetail } from '../../store/actions';
import {
  groupsDetailReducer,
  groupDevicesInfoReducer,
} from '../../store/reducers';
import GroupsDetailInfo from './GroupsDetailInfo';

import { InventoryTable } from '@redhat-cloud-services/frontend-components/components/esm/Inventory';

const GroupsDetail = () => {
  const inventory = useRef(null);
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const groupName = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.name || ''
  );
  const isLoading = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.isLoading
  );

  useEffect(() => {
    const registered = getRegistry().register({
      groupsDetailReducer,
      groupDevicesInfoReducer,
    });
    dispatch(loadGroupsDetail(uuid));
    () => registered();
  }, []);

  const onRefresh = (options, callback) => {
    if (!callback && inventory && inventory.current) {
      inventory.current.onRefreshData(options);
    } else if (callback) {
      callback(options);
    }
  };
  return (
    <Fragment>
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbItem>
            <Link to={routes.groups}>Groups</Link>
          </BreadcrumbItem>
          <BreadcrumbItem isActive>
            {isLoading === false ? groupName : <Skeleton />}
          </BreadcrumbItem>
        </Breadcrumb>
      </PageHeader>
      <Main className="edge-groups--detail">
        <Stack hasGutter>
          <StackItem className="edge-groups--detail__info">
            <GroupsDetailInfo uuid={uuid} />
          </StackItem>
          <StackItem isFilled>
            <InventoryTable
              ref={inventory}
              onRefresh={onRefresh}
              onLoad={({ mergeWithEntities }) => {
                getRegistry().register({
                  ...mergeWithEntities(),
                });
              }}
            />
          </StackItem>
        </Stack>
      </Main>
    </Fragment>
  );
};

export default GroupsDetail;
