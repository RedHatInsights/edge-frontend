import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  Suspense,
  useReducer,
} from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { loadEdgeImages } from '../../store/actions';
import { RegistryContext } from '../../store';
import { edgeImagesReducer } from '../../store/reducers';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
  Button,
  Skeleton,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import { DisconnectedIcon, PlusCircleIcon } from '@patternfly/react-icons';
import flatten from 'lodash/flatten';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
} from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { useHistory } from 'react-router-dom';
import { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/ReducerRegistry';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import {
  imageTypeMapper,
  composeStatus,
  releaseMapper,
} from '../ImageManagerDetail/constants';
import {
  isEmptyFilters,
  constructActiveFilters,
  onDeleteFilter,
} from '../../constants';

const CreateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "CreateImageWizard" */ '../ImageManager/CreateImageWizard'
  )
);

const columns = [
  {
    title: 'Name',
    type: 'name',
    transforms: [sortable],
  },
  'Version',
  {
    title: 'Distribution',
    type: 'distribution',
    transforms: [sortable],
  },
  {
    title: 'Type',
    type: 'image_type',
    transforms: [sortable],
  },
  {
    title: 'Created',
    type: 'created_at',
    transforms: [sortable],
  },
  {
    title: 'Status',
    type: 'status',
    transforms: [sortable],
  },
];

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
  imageType: {
    label: 'Image type',
    key: 'image_type',
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
  const history = useHistory();
  const [activeFilters, dispatchActiveFilters] = useReducer(
    activeFilterReducer,
    defaultFilters
  );
  const [perPage, setPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [opened, setOpened] = useState([]);
  const [sortBy, setSortBy] = useState({ index: 4, direction: 'desc' });
  const dispatch = useDispatch();
  const { getRegistry } = useContext(RegistryContext);
  const { isLoading, hasError, data } = useSelector(
    ({ edgeImagesReducer }) => ({
      isLoading:
        edgeImagesReducer?.isLoading !== undefined
          ? edgeImagesReducer?.isLoading
          : true,
      hasError: edgeImagesReducer?.hasError || false,
      data: edgeImagesReducer?.data || null,
    }),
    shallowEqual
  );

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
        type: 'text',
        filterValues: {
          key: 'distribution-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'distribution',
              value,
            }),
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
            value: item,
            label: item,
          })),
          value: activeFilters?.status?.value || [],
        },
      },
      {
        label: defaultFilters.imageType.label,
        type: 'checkbox',
        filterValues: {
          key: 'image-type-filter',
          onChange: (_event, value) =>
            dispatchActiveFilters({
              type: 'UPDATE_FILTER',
              property: 'imageType',
              value,
            }),
          items: Object.entries(imageTypeMapper).map(([value, label]) => ({
            value,
            label,
          })),
          value: activeFilters?.imageType?.value || [],
        },
      },
    ],
  };

  useEffect(() => {
    const tid = setTimeout(() => {
      loadEdgeImages(
        dispatch,
        Object.keys(activeFilters).reduce((filters, key) => {
          const filter = activeFilters[key];
          if (typeof filter.value === 'string') {
            return { ...filters, [key]: filter.value };
          }
          if (typeof filter.value === 'object') {
            if (typeof filter.value.length !== 'number') {
              return filters;
            }
            const prevValues = filters[key] || [];
            return { ...filters, [key]: [...prevValues, ...filter.value] };
          }
          return filters;
        }, {})
      );
    }, 570);
    return () => clearTimeout(tid);
  }, [activeFilters]);

  useEffect(() => {
    const registered = getRegistry().register({
      edgeImagesReducer,
    });
    return () => registered();
  }, []);

  useEffect(() => {
    if (sortBy.direction === 'asc') {
      loadEdgeImages(dispatch, {
        limit: perPage,
        offset: (page - 1) * perPage,
        sort_by: columns[sortBy.index].type,
      });
    } else {
      loadEdgeImages(dispatch, {
        limit: perPage,
        offset: (page - 1) * perPage,
        sort_by: `-${columns[sortBy.index].type}`,
      });
    }
  }, [page, perPage, sortBy]);

  const handleSort = (_event, index, direction) => {
    setSortBy({ index, direction });
  };

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Manage images" />
      </PageHeader>
      <Main className="edge-devices">
        <Fragment>
          {isLoading ? (
            <Fragment>
              <PrimaryToolbar pagination={<Skeleton />} />
              <SkeletonTable colSize={5} rowSize={15} />
            </Fragment>
          ) : null}
          {!isLoading && hasError ? (
            <EmptyState>
              <EmptyStateIcon icon={DisconnectedIcon} />
              <Title headingLevel="h4" size="lg">
                Error!
              </Title>
              <EmptyStateBody>
                There was an error while loading images list!
              </EmptyStateBody>
            </EmptyState>
          ) : null}
          {!isLoading && !hasError ? (
            <Fragment>
              {data.length > 0 ? (
                <PrimaryToolbar
                  filterConfig={filterConfig}
                  activeFiltersConfig={{
                    filters: isEmptyFilters(activeFilters)
                      ? constructActiveFilters(activeFilters)
                      : [],
                    onDelete: (_event, itemsToRemove, isAll) => {
                      if (isAll) {
                        dispatchActiveFilters({
                          type: 'DELETE_FILTER',
                          payload: defaultFilters,
                        });
                      } else {
                        dispatchActiveFilters({
                          type: 'DELETE_FILTER',
                          payload: onDeleteFilter(activeFilters, itemsToRemove),
                        });
                      }
                    },
                  }}
                  pagination={{
                    itemCount: data?.length || 0,
                    page,
                    perPage,
                    onSetPage: (_evt, newPage) => setPage(newPage),
                    onPerPageSelect: (_evt, newPerPage) =>
                      setPerPage(newPerPage),
                    isCompact: true,
                  }}
                  dedicatedAction={
                    <Button
                      onClick={() => {
                        history.push({
                          pathname: history.location.pathname,
                          search: new URLSearchParams({
                            create_image: true,
                          }).toString(),
                        });
                        setIsOpen(true);
                      }}
                      isDisabled={isLoading !== false}
                    >
                      Create new image
                    </Button>
                  }
                />
              ) : null}
              <Table
                aria-label="Manage Images table"
                onExpand={(_e, _rowIndex, _colIndex, isExpanded, rowData) => {
                  const imageId = rowData.id;
                  setOpened(
                    isExpanded
                      ? opened.filter((item) => item !== imageId)
                      : [...opened, imageId]
                  );
                }}
                ariaLabel="Images table"
                variant="compact"
                sortBy={sortBy}
                onSort={handleSort}
                cells={columns}
                rows={
                  data.length > 0
                    ? flatten(
                        data.map((item) => [
                          {
                            id: item.ID,
                            cells: [
                              {
                                title: (
                                  <Link
                                    to={`${paths['manage-images']}/${item.ID}`}
                                  >
                                    {item.Name}
                                  </Link>
                                ),
                              },
                              item?.Version,
                              {
                                title: releaseMapper[item?.Distribution],
                              },
                              {
                                title: imageTypeMapper[item?.ImageType],
                              },
                              {
                                title: <DateFormat date={item?.CreatedAt} />,
                              },
                              {
                                title: <StatusLabel status={item?.Status} />,
                              },
                            ],
                          },
                        ])
                      )
                    : [
                        {
                          heightAuto: true,
                          cells: [
                            {
                              props: { colSpan: 8 },
                              title: (
                                <Bullseye>
                                  <EmptyState variant="small">
                                    <EmptyStateIcon icon={PlusCircleIcon} />
                                    <Title headingLevel="h2" size="lg">
                                      No images found
                                    </Title>
                                    <Button
                                      onClick={() => {
                                        history.push({
                                          pathname: history.location.pathname,
                                          search: new URLSearchParams({
                                            create_image: true,
                                          }).toString(),
                                        });
                                        setIsOpen(true);
                                      }}
                                      isDisabled={isLoading !== false}
                                    >
                                      Create new images
                                    </Button>
                                  </EmptyState>
                                </Bullseye>
                              ),
                            },
                          ],
                        },
                      ]
                }
              >
                <TableHeader />
                <TableBody />
              </Table>
            </Fragment>
          ) : null}
        </Fragment>
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

export default Images;
