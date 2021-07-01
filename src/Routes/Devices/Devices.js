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
  onDeleteFilter,
} from '../../constants';
import { Tiles } from '../../components/Tiles';
import { Bullseye, Spinner } from '@patternfly/react-core';

const CreateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "CreateImageWizard" */ '../ImageManager/CreateImageWizard'
  )
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
  const [getEntities, setGetEntities] = useState();
  const [isOpen, setIsOpen] = useState(false);
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
    const searchParams = new URLSearchParams(history.location.search);
    if (searchParams.get('create_image') === 'true') {
      setIsOpen(() => true);
    }
    return () => dispatch(cleanEntities());
  }, []);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Fleet management" />
      </PageHeader>
      <Main className="edge-devices">
        <Tiles
          onNewImageClick={() => {
            history.push({
              pathname: history.location.pathname,
              search: new URLSearchParams({
                create_image: true,
              }).toString(),
            });
            setIsOpen(true);
          }}
        />
        <InventoryTable
          ref={inventory}
          onRefresh={onRefresh}
          tableProps={{
            canSelectAll: false,
          }}
          getEntities={async (_i, config) => {
            const data = await getEntities(undefined, {
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
                ],
              },
            });
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
          onRowClick={(_e, id) => history.push(`/fleet-management/${id}`)}
          onLoad={({ mergeWithEntities, api }) => {
            setGetEntities(() => api?.getEntities);
            getRegistry()?.register?.({
              ...mergeWithEntities(),
            });
          }}
        />
      </Main>
      {isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <CreateImageWizard
            navigateBack={() => {
              history.push({ pathname: history.location.pathname });
              setIsOpen(false);
            }}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Devices;
