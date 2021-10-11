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
import GeneralTable from '../../components/GeneralTable';
import ImageToolbar from './ImagesToolbar';
import { Spinner, Bullseye, Text } from '@patternfly/react-core';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import {
  imageTypeMapper,
  composeStatus,
  distributionMapper,
} from '../ImageManagerDetail/constants';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import { isEmptyFilters, constructActiveFilters } from '../../constants';
import { RegistryContext } from '../../store';
import { edgeImagesReducer } from '../../store/reducers';
import { loadEdgeImages } from '../../store/actions';

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
  const { count, data, isLoading, hasError } = useSelector(
    ({ edgeImagesReducer }) => ({
      count: edgeImagesReducer?.data?.count,
      data: edgeImagesReducer?.data?.data || null,
      isLoading:
        edgeImagesReducer?.isLoading === undefined
          ? true
          : edgeImagesReducer.isLoading,
      hasError: edgeImagesReducer?.hasError,
    }),
    shallowEqual
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

  const columnNames = [
    { title: 'Name', type: 'name', sort: true },
    { title: 'Version', type: 'version', sort: false },
    { title: 'Distribution', type: 'distribution', sort: true },
    { title: 'Type', type: 'image_type', sort: false },
    { title: 'Created', type: 'created_at', sort: true },
    { title: 'Status', type: 'status', sort: true },
  ];

  const createRows = (data) => {
    return data.map((image) => ({
      id: image.ID,
      cells: [
        {
          title: (
            <Link to={`${paths['manage-images']}/${image.ID}`}>
              {image.Name}
            </Link>
          ),
        },
        image?.Version,
        {
          title: distributionMapper[image?.Distribution],
        },
        {
          title: imageTypeMapper[image?.ImageType],
        },
        {
          title: <DateFormat date={image?.CreatedAt} />,
        },
        {
          title: <StatusLabel status={image?.Status} />,
        },
      ],
      imageStatus: image?.Status,
      isoURL: image?.Installer?.ImageBuildISOURL,
    }));
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
  const filterDep = Object.values(activeFilters);

  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData?.isoURL) {
      actionsArray.push({
        title: (
          <Text
            className="force-text-black remove-underline"
            component="a"
            href={rowData.isoURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Download
          </Text>
        ),
      });
    }

    if (rowData?.imageStatus === 'SUCCESS') {
      actionsArray.push({
        title: 'Update Image',
        onClick: (_event, _rowId, rowData) => {
          openUpdateWizard(rowData.id);
        },
      });
    }

    if (rowData?.imageStatus !== 'SUCCESS') {
      actionsArray.push({
        title: '',
      });
    }

    return actionsArray;
  };

  const areActionsDisabled = (rowData) => rowData?.imageStatus !== 'SUCCESS';

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
        <GeneralTable
          clearFilters={() =>
            dispatchActiveFilters({
              type: 'DELETE_FILTER',
              payload: defaultFilters,
            })
          }
          tableData={{ count, data, isLoading, hasError }}
          openUpdateWizard={openUpdateWizard}
          columnNames={columnNames}
          createRows={createRows}
          emptyStateMessage="No images found"
          emptyStateActionMessage="Create new images"
          emptyStateAction={openCreateWizard}
          defaultSort={{ index: 4, direction: 'desc' }}
          loadTableData={loadEdgeImages}
          filters={
            isEmptyFilters(activeFilters)
              ? constructActiveFilters(activeFilters)
              : []
          }
          filterDep={filterDep}
          pagination={pagination}
          actionResolver={actionResolver}
          areActionsDisabled={areActionsDisabled}
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
