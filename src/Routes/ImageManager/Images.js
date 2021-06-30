import React, {
  Fragment,
  useContext,
  useEffect,
  useState,
  Suspense,
} from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { loadEdgeImages, filterEdgeImages } from '../../store/actions';
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
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { imageTypeMapper } from '../ImageManagerDetail/constants';

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
    title: 'RHEL',
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

const Images = () => {
  const history = useHistory();
  const [perPage, setPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [opened, setOpened] = useState([]);
  const [sortBy, setSortBy] = useState({});
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

  useEffect(() => {
    const registered = getRegistry().register({
      edgeImagesReducer,
    });
    return () => registered();
  }, []);

  useEffect(() => {
    loadEdgeImages(dispatch, { limit: perPage, offset: (page - 1) * perPage });
  }, [page, perPage]);

  const handleSort = (_event, index, direction) => {
    setSortBy({ index, direction });
    if (direction === 'asc') {
      filterEdgeImages(dispatch, { sortColunm: columns[index].type });
    } else {
      filterEdgeImages(dispatch, { sortColunm: `-${columns[index].type}` });
    }
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
