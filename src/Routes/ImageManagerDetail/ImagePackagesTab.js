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

const createRows = (data) => {
  return data.map((packageData) => ({
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

const ImagePackagesTab = ({ imagePackageMetadata }) => {
  const [packageMetadata, setPackageMetadata] = useState({});

  useEffect(() => {
    setPackageMetadata(imagePackageMetadata);
  }, [imagePackageMetadata]);

  return (
    <GeneralTable
      apiFilterSort={false}
      filters={defaultFilters}
      loadTableData={loadImagePackageMetadata}
      tableData={{
        count: packageMetadata?.Commit?.InstalledPackages?.length,
        data: packageMetadata?.Commit?.InstalledPackages,
        isLoading: false,
        hasError: false,
      }}
      columnNames={columnNames}
      rows={
        packageMetadata?.Commit?.InstalledPackages
          ? createRows(packageMetadata?.Commit?.InstalledPackages)
          : []
      }
      actionResolver={[]}
      areActionsDisabled={true}
      defaultSort={{ index: 0, direction: 'asc' }}
    />
  );
};

ImagePackagesTab.propTypes = {
  imagePackageMetadata: PropTypes.object,
};

export default ImagePackagesTab;
