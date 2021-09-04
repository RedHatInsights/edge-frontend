import React, { useEffect, useState } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  sortable,
} from '@patternfly/react-table';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  Title,
  Button,
  Spinner,
  Bullseye,
  Text,
} from '@patternfly/react-core';
import {
  imageTypeMapper,
  distributionMapper,
} from '../ImageManagerDetail/constants';
import { Link } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import StatusLabel from '../ImageManagerDetail/StatusLabel';
import { loadEdgeImages } from '../../store/actions';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { PlusCircleIcon, SearchIcon } from '@patternfly/react-icons';
import { routes as paths } from '../../../package.json';
import {
  transformFilters,
  transformPaginationParams,
  transformSort,
  getFilterDep,
} from './constants';
import PropTypes from 'prop-types';

const ImageTable = ({
  filters,
  pagination,
  clearFilters,
  openCreateWizard,
  openUpdateWizard,
}) => {
  const [sortBy, setSortBy] = useState({ index: 4, direction: 'desc' });
  const dispatch = useDispatch();
  const { data, isLoading, hasError } = useSelector(
    ({ edgeImagesReducer }) => ({
      data: edgeImagesReducer?.data || null,
      isLoading:
        edgeImagesReducer?.isLoading === undefined
          ? true
          : edgeImagesReducer.isLoading,
      hasError: edgeImagesReducer?.hasError,
    }),
    shallowEqual
  );

  const columns = [
    {
      title: 'Name',
      type: 'name',
      transforms: toShowSort ? [] : [sortable],
    },
    'Version',
    {
      title: 'Distribution',
      type: 'distribution',
      transforms: toShowSort ? [] : [sortable],
    },
    {
      title: 'Type',
      type: 'image_type',
      transforms: [],
    },
    {
      title: 'Created',
      type: 'created_at',
      transforms: toShowSort ? [] : [sortable],
    },
    {
      title: 'Status',
      type: 'status',
      transforms: toShowSort ? [] : [sortable],
    },
  ];
  const toShowSort = isLoading || hasError || (!data?.length && hasFilters);
  useEffect(() => {
    loadEdgeImages(dispatch, {
      ...transformFilters(filters),
      ...transformPaginationParams(pagination),
      ...transformSort({
        direction: sortBy.direction,
        name: columns[sortBy.index].type,
      }),
    });
  }, [
    pagination.perPage,
    pagination.page,
    sortBy.index,
    sortBy.direction,
    // We have 3 different filters in the primary toolbar (status, name, distribution):
    getFilterDep(filters[0]),
    getFilterDep(filters[1]),
    getFilterDep(filters[2]),
  ]);
  const hasFilters = Object.keys(filters).some((filterKey) => filterKey);

  let rows = [
    {
      heightAuto: true,
      cells: [
        {
          props: { colSpan: 8 },
          title: (
            <Bullseye>
              <EmptyState variant="small">
                <EmptyStateIcon icon={Spinner} />
              </EmptyState>
            </Bullseye>
          ),
        },
      ],
    },
  ];

  if (isLoading === false && hasError === false) {
    if (!data?.length && !hasFilters) {
      rows = [
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
                      onClick={openCreateWizard}
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
      ];
    }
    if (!data?.length && hasFilters) {
      rows = [
        {
          heightAuto: true,
          cells: [
            {
              props: { colSpan: 8 },
              title: (
                <Bullseye>
                  <EmptyState variant="small">
                    <EmptyStateIcon icon={SearchIcon} />
                    <Title headingLevel="h2" size="lg">
                      No match found
                    </Title>
                    <EmptyStateSecondaryActions>
                      <Button onClick={clearFilters} variant="link">
                        Clear all filters
                      </Button>
                    </EmptyStateSecondaryActions>
                  </EmptyState>
                </Bullseye>
              ),
            },
          ],
        },
      ];
    }

    if (data?.data?.length) {
      rows = data.data.map((image) => ({
        id: image.ID,
        cells: [
          {
            title: (
              <Link to={`${paths['manage-images']}/${image.ID}`}>
                {image.Name}
              </Link>
            ),
          },
          image?.Version,
          {
            title: distributionMapper[image?.Distribution],
          },
          {
            title: imageTypeMapper[image?.ImageType],
          },
          {
            title: <DateFormat date={image?.CreatedAt} />,
          },
          {
            title: <StatusLabel status={image?.Status} />,
          },
        ],
        imageStatus: image?.Status,
        isoURL: image?.Installer?.ImageBuildISOURL,
      }));
    }
  }

  const handleSort = (_event, index, direction) => {
    setSortBy({ index, direction });
  };

  const actionResolver = (rowData) => {
    const actionsArray = [];
    if (rowData?.isoURL) {
      actionsArray.push({
        title: (
          <Text
            className="force-text-black remove-underline"
            component="a"
            href={rowData.isoURL}
            rel="noopener noreferrer"
            target="_blank"
          >
            Download
          </Text>
        ),
      });
    }

    if (rowData?.imageStatus === 'SUCCESS') {
      actionsArray.push({
        title: 'Update Image',
        onClick: (_event, _rowId, rowData) => {
          openUpdateWizard(rowData.id);
        },
      });
    }

    if (rowData?.imageStatus !== 'SUCCESS' || !rowData?.isoURL) {
      actionsArray.push({
        title: '',
      });
    }

    return actionsArray;
  };

  const areActionsDisabled = (rowData) =>
    rowData?.imageStatus !== 'SUCCESS' && !rowData?.isoURL;

  return (
    <Table
      variant="compact"
      aria-label="Manage Images table"
      sortBy={sortBy}
      onSort={handleSort}
      actionResolver={actionResolver}
      areActionsDisabled={areActionsDisabled}
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

ImageTable.propTypes = {
  clearFilters: PropTypes.func.isRequired,
  openCreateWizard: PropTypes.func.isRequired,
  openUpdateWizard: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    perPage: PropTypes.number,
  }).isRequired,
};

export default ImageTable;
