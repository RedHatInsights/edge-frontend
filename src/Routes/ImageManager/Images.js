import React, {
  Fragment,
  useState,
  useReducer,
  useEffect,
  useContext,
  Suspense,
} from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import ImageTable from './ImageTable';
import ImageToolbar from './ImagesToolbar';
import { Spinner, Bullseye } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import {
  composeStatus,
  distributionMapper,
} from '../ImageManagerDetail/constants';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { isEmptyFilters, constructActiveFilters } from '../../constants';
import { RegistryContext } from '../../store';
import { edgeImagesReducer } from '../../store/reducers';

const CreateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "CreateImageWizard" */ '../ImageManager/CreateImageWizard'
  )
);

const UpdateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "UpdateImageWizard" */ '../ImageManager/UpdateImageWizard'
  )
);

const defaultFilters = {
  name: {
    label: 'Name',
    key: 'name',
    value: '',
  },
  distribution: {
    label: 'Distribution',
    key: 'distribution',
    value: [],
  },
  status: {
    label: 'Status',
    key: 'status',
    value: [],
  },
};

const updateFilter = (state, action) => ({
  ...state,
  [action.property]: {
    ...(state[action.property] || {}),
    value: action.value,
  },
});

const deleteFilter = (_state, action) => action.payload;

const activeFilterMapper = {
  UPDATE_FILTER: updateFilter,
  DELETE_FILTER: deleteFilter,
};

const activeFilterReducer = applyReducerHash(
  activeFilterMapper,
  defaultFilters
);

const Images = () => {
  const { getRegistry } = useContext(RegistryContext);
  const [pagination, setPagination] = useState({ page: 1, perPage: 100 });
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [UpdateWizard, setUpdateWizard] = useState({
    isOpen: false,
    imageId: null,
  });
  const history = useHistory();
  const [activeFilters, dispatchActiveFilters] = useReducer(
    activeFilterReducer,
    defaultFilters
  );

  const openCreateWizard = () => {
    history.push({
      pathname: history.location.pathname,
      search: new URLSearchParams({
        create_image: true,
      }).toString(),
    });
    setIsCreateWizardOpen(true);
  };

  const openUpdateWizard = (id) => {
    history.push({
      pathname: history.location.pathname,
      search: new URLSearchParams({
        update_image: true,
      }).toString(),
    });
    setUpdateWizard({
      isOpen: true,
      imageId: id,
    });
  };

  const filterConfig = {
    items: [
      {
        label: defaultFilters.name.label,
        type: 'text',
        filterValues: {
          key: 'name-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'name',
              value,
            }),
          value: activeFilters?.name?.value || '',
          placeholder: 'Filter by name',
        },
      },
      {
        label: defaultFilters.distribution.label,
        type: 'checkbox',
        filterValues: {
          key: 'distribution-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'distribution',
              value,
            }),
          items: Object.entries(distributionMapper).map(([value, label]) => ({
            label,
            value,
          })),
          value: activeFilters?.distribution?.value || '',
        },
      },
      {
        label: defaultFilters.status.label,
        type: 'checkbox',
        filterValues: {
          key: 'status-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'status',
              value,
            }),
          items: composeStatus.map((item) => ({
            label: item,
            value: item,
          })),
          value: activeFilters?.status?.value || [],
        },
      },
    ],
  };

  useEffect(() => {
    const registered = getRegistry().register({ edgeImagesReducer });
    return () => registered();
  }, []);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Manage images" />
      </PageHeader>
      <Main className="edge-devices">
        <ImageToolbar
          setPagination={setPagination}
          pagination={pagination}
          filterConfig={filterConfig}
          activeFilters={activeFilters}
          dispatchActiveFilters={dispatchActiveFilters}
          defaultFilters={defaultFilters}
          openCreateWizard={openCreateWizard}
        />
        <ImageTable
          clearFilters={() =>
            dispatchActiveFilters({
              type: 'DELETE_FILTER',
              payload: defaultFilters,
            })
          }
          openCreateWizard={openCreateWizard}
          openUpdateWizard={openUpdateWizard}
          filters={
            isEmptyFilters(activeFilters)
              ? constructActiveFilters(activeFilters)
              : []
          }
          pagination={pagination}
        />
      </Main>
      {isCreateWizardOpen && (
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
              setIsCreateWizardOpen(false);
            }}
          />
        </Suspense>
      )}
      {UpdateWizard.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateImageWizard
            navigateBack={() => {
              history.push({ pathname: history.location.pathname });
              setUpdateWizard((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            updateImageID={UpdateWizard.imageId}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Images;
