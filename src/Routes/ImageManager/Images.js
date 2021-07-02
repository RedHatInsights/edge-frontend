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
import { Table, TableHeader, TableBody } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { useHistory } from 'react-router-dom';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import {
  imageTypeMapper,
  composeStatus,
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

const columns = ['Name', 'Version', 'RHEL', 'Type', 'Created', 'Status'];

const defaultFilters = {
  name: {
    label: 'Name',
    value: '',
  },
  distribution: {
    label: 'Distribution',
    value: [],
  },
  status: {
    label: 'Status',
    value: [],
  },
  imageType: {
    label: 'Image type',
    value: [],
  },
};

const activeFilterReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FILTER':
      return {
        ...state,
        [action.property]: {
          ...(state[action.property] || {}),
          value: action.value,
        },
      };
    case 'DELETE_FILTER':
      return action.payload;
    default:
      return state;
  }
};

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
          onChange: (event, value) =>
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
          onChange: (event, value) =>
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
          onChange: (event, value) =>
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
          onChange: (event, value) =>
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
    const registered = getRegistry().register({
      edgeImagesReducer,
    });
    return () => registered();
  }, []);

  useEffect(() => {
    loadEdgeImages(dispatch, { limit: perPage, offset: (page - 1) * perPage });
  }, [page, perPage]);

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
                    onDelete: (event, itemsToRemove, isAll) => {
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
                              item?.Distribution,
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
