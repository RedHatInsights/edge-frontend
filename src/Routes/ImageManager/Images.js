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
} from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';
import {
  Table,
  TableHeader,
  TableBody,
  compoundExpand,
} from '@patternfly/react-table';
import flatten from 'lodash/flatten';

const columns = [
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
              onExpand={(_e, rowIndex) => {
                setOpened(
                  opened.includes(rowIndex)
                    ? opened.filter((item) => item !== rowIndex)
                    : [...opened, rowIndex]
                );
              }}
              ariaLabel="Images table"
              cells={columns}
              rows={flatten(
                data.data.map((item, index) => {
                  const isOpen = opened.some(
                    (oneOpen) => oneOpen === 2 * index
                  );
                  return [
                    {
                      isOpen,
                      cells: [
                        {
                          title: (
                            <DateFormat date={new Date(item.created_at)} />
                          ),
                        },
                        {
                          title:
                            item?.request?.customizations?.packages?.length,
                          props: {
                            isOpen,
                          },
                        },
                        item?.request?.distribution,
                        item?.request?.image_requests?.[0]?.architecture,
                      ],
                    },
                    {
                      parent: 2 * index,
                      compoundParent: 1,
                      cells: [
                        {
                          title: 'Something!' + index,
                          props: { colSpan: 6, className: 'pf-m-no-padding' },
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
