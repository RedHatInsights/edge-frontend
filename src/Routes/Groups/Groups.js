import React, { useEffect, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGroups } from '../../store/actions';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import {
  groupsReducer,
  thresholdReducer,
  devicesInfoReducer,
  canariesInfoReducer,
} from '../../store/reducers';
import { statusMapper } from '../../constants';
import {
  PageHeader,
  PageHeaderTitle,
  Main,
} from '@redhat-cloud-services/frontend-components';
import {
  Stack,
  StackItem,
  Pagination,
  Skeleton,
  Button,
} from '@patternfly/react-core';
import {
  PrimaryToolbar,
  TableToolbar,
  SkeletonTable,
} from '@redhat-cloud-services/frontend-components';
import GroupsInfo from './GroupsInfo';
import GroupsTable from './GroupsTable';

const Groups = () => {
  const [activeFilters, setActiveFilters] = useState({});
  const dispatch = useDispatch();
  const isLoading = useSelector(
    ({ groupsReducer }) => groupsReducer?.isLoading
  );
  const meta = useSelector(
    ({ groupsReducer }) =>
      groupsReducer?.meta || {
        page: 1,
      }
  );
  useEffect(() => {
    const registered = getRegistry().register({
      groupsReducer,
      thresholdReducer,
      devicesInfoReducer,
      canariesInfoReducer,
    });
    dispatch(loadGroups());
    () => registered();
  }, []);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Available groups" />
      </PageHeader>
      <Main className="edge-groups">
        <Stack hasGutter>
          <StackItem className="edge-groups__info">
            <GroupsInfo />
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
                        Add group
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
                          label: 'Security',
                          type: 'checkbox',
                          filterValues: {
                            key: 'text-filter',
                            onChange: (event, value) =>
                              setActiveFilters({
                                ...(activeFilters || {}),
                                name: value,
                              }),
                            items: [
                              {
                                value: 'isSecure',
                                label: 'Secure',
                              },
                              {
                                value: 'nonSecure',
                                label: 'Not secure',
                              },
                            ],
                            value: activeFilters?.security || [],
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
              <GroupsTable />
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

export default Groups;
