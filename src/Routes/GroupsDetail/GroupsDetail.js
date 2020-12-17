import React, { Fragment, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  PageHeader,
  Main,
  PrimaryToolbar,
  TableToolbar,
  SkeletonTable,
} from '@redhat-cloud-services/frontend-components';
import {
  Breadcrumb,
  BreadcrumbItem,
  Skeleton,
  Stack,
  StackItem,
  Pagination,
  Button,
} from '@patternfly/react-core';
import { statusMapper } from '../../constants';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import { routes } from '../../../package.json';
import { loadGroupsDetail } from '../../store/actions';
import {
  groupsDetailReducer,
  groupDevicesInfoReducer,
} from '../../store/reducers';
import DevicesTable from './DevicesTable';
import GroupsDetailInfo from './GroupsDetailInfo';

const GroupsDetail = () => {
  const { uuid } = useParams();
  const [activeFilters, setActiveFilters] = useState({});
  const dispatch = useDispatch();
  const groupName = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.name || ''
  );
  const isLoading = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.isLoading
  );
  const meta = useSelector(
    ({ groupsDetailReducer }) =>
      groupsDetailReducer?.meta || {
        page: 1,
      }
  );

  useEffect(() => {
    const registered = getRegistry().register({
      groupsDetailReducer,
      groupDevicesInfoReducer,
    });
    dispatch(loadGroupsDetail(uuid));
    () => registered();
  }, []);
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
            <PrimaryToolbar
              {...(isLoading === false
                ? {
                    pagination: {
                      itemCount: meta?.count,
                      page: meta?.offset / meta?.limit + 1,
                      perPage: Number(meta?.limit),
                      isCompact: true,
                    },
                    dedicatedAction: (
                      <Button
                        onClick={() => console.log('ff')}
                        isDisabled={isLoading !== false}
                      >
                        Add device
                      </Button>
                    ),
                    filterConfig: {
                      items: [
                        {
                          label: 'Name',
                          type: 'text',
                          filterValues: {
                            key: 'text-filter',
                            onChange: (event, value) =>
                              setActiveFilters({
                                ...(activeFilters || {}),
                                name: value,
                              }),
                            value: activeFilters?.name || '',
                            placeholder: 'Filter by name',
                          },
                        },
                        {
                          label: 'Status',
                          type: 'checkbox',
                          filterValues: {
                            key: 'text-filter',
                            onChange: (event, value) =>
                              setActiveFilters({
                                ...(activeFilters || {}),
                                name: value,
                              }),
                            items: statusMapper.map((item) => ({
                              value: item,
                              label: `${item
                                .charAt(0)
                                .toUpperCase()}${item.slice(1)}`,
                            })),
                            value: activeFilters?.status || [],
                          },
                        },
                      ],
                    },
                  }
                : {
                    pagination: <Skeleton />,
                  })}
            />
            {isLoading === false ? (
              <DevicesTable uuid={uuid} />
            ) : (
              <SkeletonTable colSize={5} rowSize={15} />
            )}
            <TableToolbar isFooter>
              {isLoading === false && (
                <Pagination
                  itemCount={meta?.count}
                  page={meta?.offset / meta?.limit + 1}
                  perPage={Number(meta?.limit)}
                  dropDirection="up"
                />
              )}
            </TableToolbar>
          </StackItem>
        </Stack>
      </Main>
    </Fragment>
  );
};

export default GroupsDetail;
