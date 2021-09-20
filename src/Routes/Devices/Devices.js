import React, {
  Fragment,
  useRef,
  useEffect,
  useContext,
  useState,
  Suspense,
} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { cleanEntities } from '../../store/actions';
import { RegistryContext } from '../../store';
import {
  isEmptyFilters,
  constructActiveFilters,
  //onDeleteFilter,
} from '../../constants';
import { Tiles } from '../../components/Tiles';
import { Bullseye, Spinner } from '@patternfly/react-core';
import DeviceStatus from './DeviceStatus';
import { getDeviceHasUpdate } from '../../api';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "CreateImageWizard" */ './UpdateDeviceModal')
);

const defaultFilters = {
  deviceStatus: {
    label: 'Device status',
    value: [],
    titles: [],
  },
};

const deviceStatusMapper = [
  {
    value: 'approval',
    label: 'Required approval',
  },
  {
    value: 'ophaned',
    label: 'Orphaned',
  },
  {
    value: 'delivering',
    label: 'On the way',
  },
];

const Devices = () => {
  const [activeFilters] = useState(defaultFilters);
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
  });
  const { getRegistry } = useContext(RegistryContext);
  const inventory = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const onRefresh = (options, callback) => {
    if (!callback && inventory && inventory.current) {
      inventory.current.onRefreshData(options);
    } else if (callback) {
      callback(options);
    }
  };

  useEffect(() => {
    insights.chrome.registerModule('inventory');
    const searchParams = new URLSearchParams(history.location.search);
    if (searchParams.get('update_device') === 'true') {
      setUpdateModal((prevState) => {
        return {
          ...prevState,
          isOpen: true,
        };
      });
    }
    return () => dispatch(cleanEntities());
  }, []);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Fleet management" />
      </PageHeader>
      <Main className="edge-devices">
        <Tiles />
        <InventoryTable
          ref={inventory}
          onRefresh={onRefresh}
          tableProps={{
            canSelectAll: false,
            variant: 'compact',
            actionResolver: (rowData) => {
              return rowData.system_profile.image_data
                ? [
                    {
                      title: 'Update',
                      onClick: (_event, _index, rowData) => {
                        setUpdateModal((prevState) => {
                          return {
                            ...prevState,
                            isOpen: true,
                            deviceData: rowData,
                          };
                        });
                      },
                    },
                  ]
                : [
                    {
                      title: 'No Action',
                    },
                  ];
            },
            areActionsDisabled: (rowData) => !rowData.system_profile.image_data,
          }}
          columns={(defaultColumns) => {
            const newColumns = defaultColumns.filter((column) =>
              ['display_name', 'updated'].includes(column.key)
            );
            newColumns.filter((col) => col.key === 'updated')[0].props = {
              width: 20,
            };

            return [
              ...newColumns,
              {
                key: 'system_profile',
                title: 'Device status',
                // eslint-disable-next-line react/display-name
                renderFunc: (sysProf) => (
                  <DeviceStatus
                    rpm_ostree_deployments={sysProf.rpm_ostree_deployments}
                    updateTransactions={sysProf.UpdateTransactions}
                  />
                ),
                props: { width: 20, isStatic: true },
              },
            ];
          }}
          getEntities={async (
            _items,
            config,
            _showTags,
            defaultGetEntities
          ) => {
            const defaultData = await defaultGetEntities(undefined, {
              ...config,
              filter: {
                ...config.filter,
                system_profile: {
                  ...config.filter?.system_profile,
                  host_type: 'edge',
                },
              },
              fields: {
                ...config?.fields,
                system_profile: [
                  ...(config?.fields?.system_profile || []),
                  'host_type',
                  'operating_system',
                  'greenboot_status',
                  'greenboot_fallback_detected',
                  'rpm_ostree_deployments',
                ],
              },
            });

            const promises = defaultData.results.map(async (device) => {
              const getImageInfo = await getDeviceHasUpdate(device.id);
              const imageInfo =
                !getImageInfo || getImageInfo === 404
                  ? { data: null }
                  : getImageInfo;
              return {
                ...device,
                system_profile: {
                  ...device.system_profile,
                  image_data: Object.prototype.hasOwnProperty.call(
                    imageInfo,
                    'data'
                  )
                    ? null
                    : imageInfo,
                },
              };
            });
            const rows = await Promise.all(promises);
            return { ...defaultData, results: rows };
          }}
          hideFilters={{ registeredWith: true }}
          // NOTE: add back in when device status is sent with inventory data
          //filterConfig={{
          //  items: [
          //    {
          //      label: activeFilters?.deviceStatus?.label,
          //      type: 'checkbox',
          //      filterValues: {
          //        onChange: (event, value) => {
          //          setActiveFilters(() => ({
          //            ...(activeFilters || {}),
          //            deviceStatus: {
          //              ...(activeFilters?.deviceStatus || {}),
          //              value,
          //            },
          //          }));
          //          inventory.current.onRefreshData();
          //        },
          //        items: deviceStatusMapper,
          //        value: activeFilters?.deviceStatus?.value || [],
          //      },
          //    },
          //  ],
          //}}
          hasCheckbox={false}
          activeFiltersConfig={{
            ...(isEmptyFilters(activeFilters) && {
              filters: constructActiveFilters(
                activeFilters,
                (value) =>
                  deviceStatusMapper.find((item) => item.value === value)?.label
              ),
            }),
            // NOTE: Adding custom onDelete function overrides default inventory deletion behavior
            //onDelete: (event, itemsToRemove, isAll) => {
            //  console.log(itemsToRemove);
            //  if (isAll) {
            //    setActiveFilters(defaultFilters);
            //  } else {
            //    setActiveFilters(() =>
            //      onDeleteFilter(activeFilters, itemsToRemove)
            //    );
            //  }
            //  inventory.current.onRefreshData();
            //},
          }}
          onRowClick={(_e, id) => history.push(`/fleet-management/${id}`)}
          onLoad={({ mergeWithEntities }) => {
            getRegistry()?.register?.({
              ...mergeWithEntities(),
            });
          }}
        />
      </Main>
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
              history.push({ pathname: history.location.pathname });
              setUpdateModal((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Devices;
