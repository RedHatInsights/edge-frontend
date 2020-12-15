import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadGroups } from '../../store/actions';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import { groupsReducer } from '../../store/reducers';
import {
  PageHeader,
  PageHeaderTitle,
  Main,
} from '@redhat-cloud-services/frontend-components';
import { Stack, StackItem, Pagination, Skeleton } from '@patternfly/react-core';
import {
  PrimaryToolbar,
  TableToolbar,
  SkeletonTable,
} from '@redhat-cloud-services/frontend-components';
import GroupsInfo from './GroupsInfo';
import GroupsTable from './GroupsTable';

const Groups = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector(
    ({ groupsReducer }) => groupsReducer?.isLoading
  );
  const meta = useSelector(
    ({ groupsReducer }) =>
      groupsReducer?.meta || {
        page: 1,
      }
  );
  useEffect(() => {
    const registered = getRegistry().register({ groupsReducer });
    dispatch(loadGroups());
    () => registered();
  }, []);
  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Available groups" />
      </PageHeader>
      <Main className="edge-groups">
        <Stack hasGutter>
          <StackItem className="edge-groups__info">
            <GroupsInfo />
          </StackItem>
          <StackItem isFilled>
            <PrimaryToolbar
              {...(isLoading === false
                ? {
                    pagination: {
                      itemCount: meta?.count,
                      page: meta?.offset / meta?.limit + 1,
                      perPage: Number(meta?.limit),
                      isCompact: true,
                    },
                  }
                : {
                    pagination: <Skeleton />,
                  })}
            />
            {isLoading === false ? (
              <GroupsTable />
            ) : (
              <SkeletonTable colSize={5} rowSize={15} />
            )}
            <TableToolbar isFooter>
              {isLoading === false && (
                <Pagination
                  itemCount={meta?.count}
                  page={meta?.offset / meta?.limit + 1}
                  perPage={Number(meta?.limit)}
                  dropDirection="up"
                />
              )}
            </TableToolbar>
          </StackItem>
        </Stack>
      </Main>
    </Fragment>
  );
};

export default Groups;
