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
} from '@patternfly/react-core';
import { DisconnectedIcon, PlusCircleIcon } from '@patternfly/react-icons';
import {
  Table,
  TableHeader,
  TableBody,
  compoundExpand,
  cellWidth,
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
    title: 'UUID',
    cellTransforms: [cellWidth(25)],
  },
  'Created',
  {
    title: 'Packages',
    cellTransforms: [compoundExpand],
  },
  'Distrubution',
  'Architecture',
];

const Images = () => {
  const history = useHistory();
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
                cells={columns}
                rows={
                  data.length > 0
                    ? flatten(
                        data.map((item, index) => {
                          const packagesNumber =
                            item?.Commit?.Packages?.length || 0;
                          // if there are no packages - disable the option to expand row.
                          const isOpen =
                            packagesNumber > 0
                              ? opened.some((oneOpen) => oneOpen === item.ID)
                              : undefined;
                          return [
                            {
                              id: item.ID,
                              isOpen,
                              cells: [
                                {
                                  title: (
                                    <Link
                                      to={`${paths['manage-images']}/${item.ID}`}
                                    >
                                      {item.ID}
                                    </Link>
                                  ),
                                },
                                {
                                  title: (
                                    <DateFormat
                                      date={new Date(item.CreatedAt)}
                                    />
                                  ),
                                },
                                {
                                  title: packagesNumber,
                                  props: {
                                    isOpen,
                                    // to align text with other rows that are expandable use this class
                                    className:
                                      packagesNumber === 0
                                        ? 'force-padding-left'
                                        : '',
                                  },
                                },
                                item?.Distribution,
                                item?.Commit?.Arch || '',
                              ],
                            },
                            {
                              parent: 2 * index,
                              compoundParent: 2,
                              cells: [
                                {
                                  title:
                                    packagesNumber > 0 ? (
                                      <LabelGroup>
                                        {item.Commit.Packages.map(
                                          (packageName) => (
                                            <Label key={packageName}>
                                              {packageName}
                                            </Label>
                                          )
                                        )}
                                      </LabelGroup>
                                    ) : undefined,
                                  props: {
                                    colSpan: 6,
                                    className: 'packages-compound-expand',
                                  },
                                },
                              ],
                            },
                          ];
                        })
                      )
                    : [{
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
                  >Create new images</Button>
              </EmptyState>
            </Bullseye>
                          )
                        }
                      ]
                    }]
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
