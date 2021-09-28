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
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState({});
  const [rows, setRows] = useState([]);
  const { data, imageName } = useSelector(
    ({ imageDetailReducer }) => ({
      data: imageDetailReducer?.data?.Commit?.Packages || null,
      imageName: imageDetailReducer?.data?.name || null,
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

  const parserRows = (rows) => {
    return rows.map((pack) => [
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
    ]);
  };

  const handleSetPage = (_evt, newPage, perPage, startIdx, endIdx) => {
    setPage(newPage);
    setRows(flatten(parserRows(data.slice(startIdx, endIdx))));
  };

  const handlePerPage = (_evt, newPerPage, newPage, startIdx, endIdx) => {
    setPerPage(newPerPage);
    setPage(newPage);
    setRows(flatten(parserRows(data.slice(startIdx, endIdx))));
  };

  useEffect(() => {
    setRows(
      data !== null && data.length > 0
        ? flatten(parserRows(data.slice(0, perPage)))
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
    const sortedRows = data.sort((a, b) =>
      a.Name < b.Name ? -1 : a.Name > b.Name ? 1 : 0
    );
    setSortBy({
      index,
      direction,
    });
    setRows(
      flatten(
        parserRows(
          direction === SortByDirection.asc ? sortedRows : sortedRows.reverse()
        ).slice(0, perPage)
      )
    );
    setPage(0);
  };

  return (
    <Fragment>
      {data ? (
        <PrimaryToolbar
          pagination={{
            itemCount: data?.length || 0,
            page,
            perPage,
            onSetPage: handleSetPage,
            onPerPageSelect: handlePerPage,
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
