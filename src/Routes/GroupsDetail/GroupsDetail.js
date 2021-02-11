import React, {
  Fragment,
  useEffect,
  useRef,
  Suspense,
  lazy,
  useState,
  useContext,
} from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { PageHeader } from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  Breadcrumb,
  BreadcrumbItem,
  Skeleton,
  Stack,
  StackItem,
  Button,
} from '@patternfly/react-core';
import { routes } from '../../../package.json';
import { loadGroupsDetail, cleanEntities } from '../../store/actions';
import {
  groupsDetailReducer,
  groupDevicesInfoReducer,
} from '../../store/reducers';
import GroupsDetailInfo from './GroupsDetailInfo';

import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { systemsList } from '../../store/groupsDetail';
const InventoryForm = lazy(() => import('../../components/InventoryForm'));
import schema from './addDeviceSchema';
import { groupsDetail, updateGroup } from '../../api';
import {
  statusMapper,
  isEmptyFilters,
  constructActiveFilters,
  onDeleteFilter,
} from '../../constants';
import { RegistryContext } from '../../store';

const defaultFilters = {
  name: {
    label: 'Name',
    value: '',
  },
  version: {
    label: 'Version',
    value: [],
  },
  status: {
    label: 'Status',
    value: [],
  },
};

const GroupsDetail = () => {
  const { getRegistry } = useContext(RegistryContext);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [getEntities, setGetEntities] = useState();
  const [unregister, setUnregister] = useState();
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
  const history = useHistory();
  const inventory = useRef(null);
  const { uuid } = useParams();
  const dispatch = useDispatch();
  const groupName = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.name || ''
  );
  const isLoading = useSelector(
    ({ groupsDetailReducer }) => groupsDetailReducer?.isLoading
  );

  const items = useSelector(
    ({ groupsDetailReducer }) =>
      groupsDetailReducer?.devices?.map(({ uuid, ...rest }) => ({
        id: uuid,
        ...rest,
      })),
    shallowEqual
  );
  useEffect(() => {
    const registered = getRegistry().register({
      groupsDetailReducer,
      groupDevicesInfoReducer,
    });
    dispatch(loadGroupsDetail(uuid));
    return () => {
      registered?.();
      unregister?.();
      dispatch(cleanEntities());
    };
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
            <InventoryTable
              ref={inventory}
              page={1}
              tableProps={{
                canSelectAll: false,
              }}
              hideFilters={{ all: true }}
              getEntities={async (_items, config) => {
                const { results } = await groupsDetail(uuid, {});
                const data = await getEntities?.(
                  (results || []).map(({ uuid }) => uuid),
                  {
                    ...config,
                    hasItems: true,
                  },
                  false
                );
                return {
                  ...data,
                  results: data.results.map((system) => ({
                    ...system,
                    ...results.find(({ uuid }) => uuid === system.id),
                  })),
                };
              }}
              filterConfig={{
                items: [
                  {
                    label: activeFilters?.name?.label,
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
                    },
                  },
                  {
                    label: activeFilters?.version?.label,
                    type: 'checkbox',
                    filterValues: {
                      onChange: (event, value) =>
                        setActiveFilters(() => ({
                          ...(activeFilters || {}),
                          version: {
                            ...(activeFilters?.version || {}),
                            value,
                          },
                        })),
                      value: activeFilters?.version?.value || [],
                      items: [
                        {
                          label: 'All versions',
                          value: 'all',
                        },
                      ],
                    },
                  },
                  {
                    label: activeFilters?.status?.label,
                    type: 'checkbox',
                    filterValues: {
                      onChange: (event, value) =>
                        setActiveFilters(() => ({
                          ...(activeFilters || {}),
                          status: {
                            ...(activeFilters?.status || {}),
                            value,
                          },
                        })),
                      items: statusMapper.map((item) => ({
                        value: item,
                        label: `${item.charAt(0).toUpperCase()}${item.slice(
                          1
                        )}`,
                      })),
                      value: activeFilters?.status?.value || [],
                    },
                  },
                ],
              }}
              activeFiltersConfig={{
                ...(isEmptyFilters(activeFilters) && {
                  filters: constructActiveFilters(activeFilters),
                }),
                onDelete: (event, itemsToRemove, isAll) => {
                  if (isAll) {
                    setActiveFilters(defaultFilters);
                  } else {
                    setActiveFilters(() =>
                      onDeleteFilter(activeFilters, itemsToRemove)
                    );
                  }
                },
              }}
              onRowClick={(_e, id) => history.push(`/groups/${uuid}/${id}`)}
              onLoad={({ mergeWithEntities, INVENTORY_ACTION_TYPES, api }) => {
                setGetEntities(() => api?.getEntities);
                setUnregister(() =>
                  getRegistry().register({
                    ...mergeWithEntities(systemsList(INVENTORY_ACTION_TYPES)),
                  })
                );
              }}
            >
              <Button onClick={() => setIsAddDeviceOpen(true)}>
                Add device
              </Button>
            </InventoryTable>
          </StackItem>
        </Stack>
      </Main>
      {isAddDeviceOpen && (
        <Suspense fallback="">
          <InventoryForm
            selectedSystems={items}
            schema={schema}
            isOpened={isAddDeviceOpen}
            title="Add new device"
            onAction={(isSubmit, values) => {
              if (isSubmit) {
                (async () => {
                  await updateGroup({
                    uuid,
                    systemIDs: values.selected,
                  });
                  dispatch(loadGroupsDetail(uuid));
                  inventory.current.onRefreshData();
                })();
              }
              setIsAddDeviceOpen(false);
            }}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default GroupsDetail;
