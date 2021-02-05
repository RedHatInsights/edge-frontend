import React, { useEffect, Fragment, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNewGroup } from '../../api/';
import { loadGroups } from '../../store/actions';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import {
  groupsReducer,
  thresholdReducer,
  devicesInfoReducer,
  canariesInfoReducer,
} from '../../store/reducers';
import {
  statusMapper,
  isEmptyFilters,
  constructActiveFilters,
  onDeleteFilter,
} from '../../constants';
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
const InventoryForm = lazy(() => import('../../components/InventoryForm'));
import schema from './newGroupSchema';

const defaultFilters = {
  name: {
    label: 'Name',
    value: '',
  },
  security: {
    label: 'Security',
    value: [],
  },
  status: {
    label: 'Status',
    value: [],
  },
};

const Groups = () => {
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(
    ({ groupsReducer }) => groupsReducer?.isLoading
  );
  const systemsCount = useSelector(({ groupsReducer }) =>
    groupsReducer?.groups?.reduce(
      (acc, { sensors } = {}) => acc + (sensors?.length || 0),
      0
    )
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
            <GroupsInfo numberOfSystems={systemsCount} />
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
                        onClick={() => setIsNewGroupOpen(true)}
                        isDisabled={isLoading !== false}
                      >
                        Add group
                      </Button>
                    ),
                    filterConfig: {
                      items: [
                        {
                          label: defaultFilters.name.label,
                          type: 'text',
                          filterValues: {
                            key: 'text-filter',
                            onChange: (event, value) =>
                              setActiveFilters(() => ({
                                ...activeFilters,
                                name: {
                                  ...(activeFilters?.name || {}),
                                  value,
                                },
                              })),
                            value: activeFilters?.name?.value || '',
                            placeholder: 'Filter by name',
                          },
                        },
                        {
                          label: defaultFilters.security.label,
                          type: 'checkbox',
                          filterValues: {
                            key: 'security-filter',
                            onChange: (event, value) =>
                              setActiveFilters({
                                ...(activeFilters || {}),
                                security: {
                                  ...(activeFilters?.security || {}),
                                  value,
                                },
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
                            value: activeFilters?.security?.value || [],
                          },
                        },
                        {
                          label: defaultFilters.status.label,
                          type: 'checkbox',
                          filterValues: {
                            key: 'status-filter',
                            onChange: (event, value) =>
                              setActiveFilters({
                                ...(activeFilters || {}),
                                status: {
                                  ...(activeFilters?.status || {}),
                                  value,
                                },
                              }),
                            items: statusMapper.map((item) => ({
                              value: item,
                              label: `${item
                                .charAt(0)
                                .toUpperCase()}${item.slice(1)}`,
                            })),
                            value: activeFilters?.status?.value || [],
                          },
                        },
                      ],
                    },
                    activeFiltersConfig: {
                      filters: isEmptyFilters(activeFilters)
                        ? constructActiveFilters(activeFilters)
                        : [],
                      onDelete: (event, itemsToRemove, isAll) => {
                        if (isAll) {
                          setActiveFilters(defaultFilters);
                        } else {
                          setActiveFilters(() =>
                            onDeleteFilter(activeFilters, itemsToRemove)
                          );
                        }
                      },
                    },
                  }
                : {
                    pagination: <Skeleton />,
                  })}
            />
            {isLoading === false ? (
              <GroupsTable onAddNewGroup={() => setIsNewGroupOpen(true)} />
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
      {isNewGroupOpen && (
        <Suspense fallback="">
          <InventoryForm
            schema={schema}
            isOpened={isNewGroupOpen}
            onAction={(isSubmit, values) => {
              if (isSubmit) {
                (async () => {
                  await createNewGroup({
                    groupName: values['group-name'],
                    isSecure: values['is-secure'],
                    systemIDs: values.selected,
                  });
                  dispatch(loadGroups());
                })();
              }
              setIsNewGroupOpen(false);
            }}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Groups;
