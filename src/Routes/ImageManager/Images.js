import React, { Fragment, useContext, useEffect, useState } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { loadImages } from '../../store/actions';
import { RegistryContext } from '../../store';
import { imagesReducer } from '../../store/reducers';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import {
  Bullseye,
  Spinner,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title,
  LabelGroup,
  Label,
} from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';
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
  const [opened, setOpened] = useState([]);
  const dispatch = useDispatch();
  const { getRegistry } = useContext(RegistryContext);
  const { isLoading, hasError, data } = useSelector(
    ({ imagesReducer }) => ({
      isLoading:
        imagesReducer?.isLoading !== undefined
          ? imagesReducer?.isLoading
          : true,
      hasError: imagesReducer?.hasError || false,
      data: imagesReducer?.data || null,
    }),
    shallowEqual
  );
  useEffect(() => {
    const registered = getRegistry().register({
      imagesReducer,
    });
    loadImages(dispatch);
    return () => registered();
  }, []);

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Manage images" />
      </PageHeader>
      <Main className="edge-devices">
        {!isLoading ? (
          hasError ? (
            <EmptyState>
              <EmptyStateIcon icon={DisconnectedIcon} />
              <Title headingLevel="h4" size="lg">
                Error!
              </Title>
              <EmptyStateBody>
                There was an error while loading images list!
              </EmptyStateBody>
            </EmptyState>
          ) : (
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
              rows={flatten(
                data.data.map((item, index) => {
                  const packagesNumber =
                    item?.request?.customizations?.packages?.length || 0;
                  // if there are no packages - disable the option to expand row.
                  const isOpen =
                    packagesNumber > 0
                      ? opened.some((oneOpen) => oneOpen === item.id)
                      : undefined;
                  return [
                    {
                      id: item.id,
                      isOpen,
                      cells: [
                        {
                          title: (
                            <Link to={`${paths['manage-images']}/${item.id}`}>
                              {item.id}
                            </Link>
                          ),
                        },
                        {
                          title: (
                            <DateFormat date={new Date(item.created_at)} />
                          ),
                        },
                        {
                          title: packagesNumber,
                          props: {
                            isOpen,
                            // to align text with other rows that are expandable use this class
                            className:
                              packagesNumber === 0 ? 'force-padding-left' : '',
                          },
                        },
                        item?.request?.distribution,
                        item?.request?.image_requests?.[0]?.architecture,
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
                                {item.request.customizations.packages.map(
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
              )}
            >
              <TableHeader />
              <TableBody />
            </Table>
          )
        ) : (
          <Bullseye>
            <Spinner />
          </Bullseye>
        )}
      </Main>
    </Fragment>
  );
};

export default Images;
