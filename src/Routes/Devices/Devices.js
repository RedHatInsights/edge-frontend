import React, {
  Fragment,
  useRef,
  useEffect,
  useContext,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { useHistory } from 'react-router-dom';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { InventoryTable } from '@redhat-cloud-services/frontend-components/Inventory';
import { cleanEntities } from '../../store/actions';
import { RegistryContext } from '../../store';
import {
  isEmptyFilters,
  constructActiveFilters,
  onDeleteFilter,
} from '../../constants';

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
  const [getEntities, setGetEntities] = useState();
  const [activeFilters, setActiveFilters] = useState(defaultFilters);
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
    return () => dispatch(cleanEntities());
  }, []);
  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Available devices" />
      </PageHeader>
      <Main className="edge-devices">
        <InventoryTable
          ref={inventory}
          onRefresh={onRefresh}
          tableProps={{
            canSelectAll: false,
          }}
          getEntities={async (_i, config) => {
            const data = await getEntities(undefined, config);
            console.log(data, activeFilters, 'This is data!');
            return data;
          }}
          hideFilters={{ registeredWith: true }}
          filterConfig={{
            items: [
              {
                label: activeFilters?.deviceStatus?.label,
                type: 'checkbox',
                filterValues: {
                  onChange: (event, value) => {
                    setActiveFilters(() => ({
                      ...(activeFilters || {}),
                      deviceStatus: {
                        ...(activeFilters?.deviceStatus || {}),
                        value,
                      },
                    }));
                    inventory.current.onRefreshData();
                  },
                  items: deviceStatusMapper,
                  value: activeFilters?.deviceStatus?.value || [],
                },
              },
            ],
          }}
          activeFiltersConfig={{
            ...(isEmptyFilters(activeFilters) && {
              filters: constructActiveFilters(
                activeFilters,
                (value) =>
                  deviceStatusMapper.find((item) => item.value === value)?.label
              ),
            }),
            onDelete: (event, itemsToRemove, isAll) => {
              if (isAll) {
                setActiveFilters(defaultFilters);
              } else {
                setActiveFilters(() =>
                  onDeleteFilter(activeFilters, itemsToRemove)
                );
              }
              inventory.current.onRefreshData();
            },
          }}
          onRowClick={(_e, id) => history.push(`/devices/${id}`)}
          onLoad={({ mergeWithEntities, api }) => {
            setGetEntities(() => api?.getEntities);
            getRegistry()?.register?.({
              ...mergeWithEntities(),
            });
          }}
        />
      </Main>
    </Fragment>
  );
};

export default Devices;
