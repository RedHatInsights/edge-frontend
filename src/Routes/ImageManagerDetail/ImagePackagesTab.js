import React, { useState, useEffect } from 'react';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import GeneralTable from '../../components/general-table/GeneralTable';
import { loadImagePackageMetadata } from '../../store/actions';
import PropTypes from 'prop-types';

const defaultFilters = [{ label: 'Name', type: 'text' }];

const columnNames = [
  { title: 'Name', type: 'name', sort: true },
  { title: 'Version', type: 'version', sort: false },
  { title: 'Release', type: 'release', sort: false },
  { title: 'Type', type: 'type', sort: false },
];

const createRows = (data, imageData, toggleTable) => {
  const rowData =
    toggleTable === 0
      ? data.filter(
          (pack) =>
            imageData?.Packages.filter((image) => pack.name === image.Name)
              .length > 0
        )
      : data;
  return rowData.map((packageData) => ({
    noApiSortFilter: [
      packageData?.name,
      packageData?.version,
      packageData?.release,
      packageData?.type,
    ],
    cells: [
      packageData?.name,
      packageData?.version,
      packageData?.release,
      packageData?.type,
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

const ImagePackagesTab = ({ imagePackageMetadata, imageData }) => {
  const [packageMetadata, setPackageMetadata] = useState({});
  const [toggleTable, setToggleTable] = useState(1);

  useEffect(() => {
    setPackageMetadata(imagePackageMetadata);
  }, [imagePackageMetadata]);

  return (
    <GeneralTable
      apiFilterSort={false}
      filters={defaultFilters}
      loadTableData={loadImagePackageMetadata}
      tableData={{
        count: toggleTable === 0 ? imageData?.Packages?.length : packageMetadata?.Commit?.InstalledPackages?.length,
        isLoading: false,
        hasError: false,
      }}
      columnNames={columnNames}
      rows={
        packageMetadata?.Commit?.InstalledPackages
          ? createRows(
              packageMetadata?.Commit?.InstalledPackages,
              imageData,
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
      emptyStateMessage='No packages to display'
    />
  );
};

ImagePackagesTab.propTypes = {
  imagePackageMetadata: PropTypes.object,
  imageData: PropTypes.object,
};

export default ImagePackagesTab;
