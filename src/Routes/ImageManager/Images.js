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
import { loadEdgeImages } from '../../store/actions';
import { RegistryContext } from '../../store';
import { edgeImagesReducer } from '../../store/reducers';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/SkeletonTable';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
  LabelGroup,
  Label,
  Button,
  Skeleton,
  Spinner,
  Bullseye,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { DisconnectedIcon, PlusCircleIcon, ExclamationCircleIcon, CheckCircleIcon, InProgressIcon } from '@patternfly/react-icons';
import {
  Table,
  TableHeader,
  TableBody,
  compoundExpand,
  cellWidth,
  sortable,
  SortByDirection
} from '@patternfly/react-table';
import flatten from 'lodash/flatten';
import { Link } from 'react-router-dom';
import { routes as paths } from '../../../package.json';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import { useHistory } from 'react-router-dom';

const CreateImageWizard = React.lazy(() =>
  import(
    /* webpackChunkName: "CreateImageWizard" */ '../ImageManager/CreateImageWizard'
  )
);

const columns = [
  {
    title: 'Name',
    transforms: [sortable]
  },
  {
    title: 'Version',
    transforms: [sortable]
  },
  {
    title: 'RHEL',
    transforms: [sortable]
  },
  {
    title: 'Type',
    transforms: [sortable]
  },
  {
    title: 'Created',
    transforms: [sortable]
  },
  {
    title: 'Status',
    transforms: [sortable]
  }
];

const Images = () => {
  const history = useHistory();
  const [perPage, setPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [opened, setOpened] = useState([]);
  const [rows, setRows] = useState([]);
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
    if (data) {
      setRows(
        flatten(
          data.map(item => {
            const statusIconHash = {
              "Ready": <CheckCircleIcon color="var(--pf-global--success-color--100)" />,
              "Image build in progress": <InProgressIcon color="var(--pf-global--palette--blue-400)" />,
              "Building error": <ExclamationCircleIcon color="var(--pf-global--danger-color--100)" />
            } 
            return [
              {
                id: item.id,
                currentStatus: item?.request.status,
                rowArray: [
                  item.request.name,
                  item.request.version,
                  item.request.distribution,
                  item.request.type,
                  item.created_at,
                  item.request.status,
                ],
                cells: [
                  {
                    title: (
                      <Link
                        to={`${paths['manage-images']}/${item.id}`}
                      >
                        {item.request.name}
                      </Link>
                    ),
                  },
                  item?.request.version,
                  item?.request.distribution,
                  item?.request.type,
                  item?.created_at,
                  {
                    title: (
                      <Flex>
                        <FlexItem>
                          {statusIconHash[item?.request.status]}
                        </FlexItem>
                        <FlexItem>
                          {item?.request.status}
                        </FlexItem>
                      </Flex>
                    )
                  },
                ],
              },
            ];
          })
        )
      )
    }
  },[])

  const actionResolver = (rowData) => {
    if (rowData.currentStatus === "Image build in progress") {
      return [
        {
          title: 'Download',
          onClick: (event, rowId) => (console.log(`Action clicked on row with id: ${rowId}`))
        }
      ]
    } else if (rowData.currentStatus === "Building error") {
      return [
        {
          title: 'Rebuild',
          onClick: (event, rowId) => (console.log(`Action clicked on row with id: ${rowId}`))
        },
        {
          title: 'Download',
          onClick: (event, rowId) => (console.log(`Action clicked on row with id: ${rowId}`))
        }
      ]
    } else {
      return [
        {
          title: 'Update Image',
          onClick: (event, rowId) => (console.log(`Action clicked on row with id: ${rowId}`))
        },
        {
          title: 'Download',
          onClick: (event, rowId) => (console.log(`Action clicked on row with id: ${rowId}`))
        }
      ]
    }
  }

  const handleSort = (event, index, direction) => {
    const sortedRows = rows.sort((a, b) => (a.rowArray[index] < b.rowArray[index] ? -1 : a.rowArray[index] > b.rowArray[index] ? 1 : 0));
    setSortBy({
      index,
      direction
    }),
    setRows(sortBy.direction === SortByDirection.asc ? sortedRows : sortedRows.reverse())
  }

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
                variant='compact'
                sortBy={sortBy}
                onSort={handleSort}
                cells={columns}
                rows={
                  data.length > 0
                    ? rows
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
                actionResolver={actionResolver}
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
