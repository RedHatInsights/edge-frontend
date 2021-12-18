import React, { useState, useEffect } from 'react';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { cellWidth } from '@patternfly/react-table';

const defaultFilters = [{ label: 'Name', type: 'text' }];

const columnNames = [
  { title: 'Name', type: 'name', sort: true, columnTransforms: [cellWidth(35)] },
  { title: 'Version', type: 'version', sort: false, columnTransforms: [cellWidth(25)] },
  { title: 'Release', type: 'release', sort: false, columnTransforms: [cellWidth(35)] },
  //{ title: 'Type', type: 'type', sort: false, columnTransforms: [cellWidth(35)] },
];

const createRows = (data, imageData, toggleTable) => {
  const rowData =
    toggleTable === 0
      ? data.filter(
          (pack) =>
            imageData.filter((image) => pack.name === image.Name).length > 0
        )
      : data;
  return rowData.map((packageData) => ({
    noApiSortFilter: [
      packageData?.name,
      packageData?.version,
      packageData?.release,
      //packageData?.type,
    ],
    cells: [
      packageData?.name,
      packageData?.version,
      packageData?.release,
      //packageData?.type,
      {
        title: (
          <a
            href={`https://access.redhat.com/downloads/content/rhel---8/x86_64/7416/${packageData?.name}/${packageData?.version}-${packageData?.release}/${packageData?.arch}/fd431d51/package`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="link"
              isSmall
              icon={<ExternalLinkAltIcon />}
              iconPosition="right"
            >
              More information
            </Button>
          </a>
        ),
      },
    ],
  }));
};

const ImagePackagesTab = ({ imageVersion }) => {
  const [packageData, setPackageData] = useState({});
  const [toggleTable, setToggleTable] = useState(1);

  useEffect(() => {
    setPackageData(imageVersion);
  }, [imageVersion]);

  return (
    <GeneralTable
      apiFilterSort={false}
      filters={defaultFilters}
      //loadTableData={loadImagePackageMetadata}
      tableData={{
        count:
          toggleTable === 0
            ? packageData?.additional_packages
            : packageData?.packages,
        isLoading: false,
        hasError: false,
      }}
      columnNames={columnNames}
      rows={
        packageData?.image?.Commit?.InstalledPackages
          ? createRows(
              packageData?.image?.Commit?.InstalledPackages,
              packageData?.image?.Packages,
              toggleTable
            )
          : []
      }
      actionResolver={[]}
      areActionsDisabled={true}
      defaultSort={{ index: 0, direction: 'asc' }}
      toggleButton={[
        { title: 'Additional', key: 0 },
        { title: 'All', key: 1 },
      ]}
      toggleAction={setToggleTable}
      toggleState={toggleTable}
      emptyStateMessage="No packages to display"
    />
  );
};

ImagePackagesTab.propTypes = {
  imageVersion: PropTypes.object,
};

export default ImagePackagesTab;
