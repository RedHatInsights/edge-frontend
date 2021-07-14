import React, { Fragment, useState, useEffect } from 'react';
import {
  EmptyState,
  Title,
  Bullseye,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
  SortByDirection,
} from '@patternfly/react-table';
import { shallowEqual, useSelector } from 'react-redux';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components/PrimaryToolbar';
import flatten from 'lodash/flatten';

const ImagePackagesTab = () => {
  const [perPage, setPerPage] = useState(100);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState({});
  const [rows, setRows] = useState([]);
  const { data, imageName } = useSelector(
    ({ imageDetailReducer }) => ({
      data: imageDetailReducer?.data?.Commit?.Packages || null,
      imageName: imageDetailReducer?.data?.Name || null,
    }),
    shallowEqual
  );

  const columns = [
    {
      title: 'Name',
      type: 'name',
      transforms: [sortable],
    },
  ];

  useEffect(() => {
    setRows(
      data !== null && data.length > 0
        ? flatten(
            data.map((pack) => [
              {
                id: pack?.ID,
                rowArray: [pack.Name],
                cells: [
                  {
                    title: (
                      <TextContent>
                        <Text component={TextVariants.p}>{pack?.Name}</Text>
                      </TextContent>
                    ),
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
                        <Title headingLevel="h2" size="lg">
                          {imageName} has no packages
                        </Title>
                      </EmptyState>
                    </Bullseye>
                  ),
                },
              ],
            },
          ]
    );
  }, [data]);

  const handleSort = (_event, index, direction) => {
    const sortedRows = rows.sort((a, b) =>
      a.rowArray[index] < b.rowArray[index]
        ? -1
        : a.rowArray[index] > b.rowArray[index]
        ? 1
        : 0
    );
    setSortBy({
      index,
      direction,
    });
    setRows(
      direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
    );
  };

  return (
    <Fragment>
      {data ? (
        <PrimaryToolbar
          pagination={{
            itemCount: data?.length || 0,
            page,
            perPage,
            onSetPage: (_evt, newPage) => setPage(newPage),
            onPerPageSelect: (_evt, newPerPage) => setPerPage(newPerPage),
            isCompact: true,
          }}
        />
      ) : null}
      <Table
        aria-label="Image packages table"
        ariaLabel="packages table"
        variant="compact"
        sortBy={sortBy}
        onSort={handleSort}
        cells={columns}
        rows={rows}
      >
        <TableHeader />
        <TableBody />
      </Table>
    </Fragment>
  );
};

export default ImagePackagesTab;
