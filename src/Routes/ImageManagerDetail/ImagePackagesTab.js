import React, { useState, useEffect } from 'react';
import { Button } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { cellWidth } from '@patternfly/react-table';
import { useHistory, useLocation, useNavigate } from 'react-router-dom';
import Empty from '../../components/Empty';
import { restorePrefixURL } from './utils';

const defaultFilters = [{ label: 'Name', type: 'text' }];

const columnNames = [
  {
    title: 'Name',
    type: 'name',
    sort: true,
    columnTransforms: [cellWidth(35)],
  },
  {
    title: 'Version',
    type: 'version',
    sort: false,
    columnTransforms: [cellWidth(25)],
  },
  {
    title: 'Release',
    type: 'release',
    sort: false,
    columnTransforms: [cellWidth(35)],
  },
  //{ title: 'Type', type: 'type', sort: false, columnTransforms: [cellWidth(35)] },
];

const createRows = ({
  distribution,
  installedPackages,
  addedPackages,
  showAll,
}) => {
  const rowData =
    showAll === 0
      ? installedPackages.filter(
          (pack) =>
            addedPackages?.filter((image) => pack.name === image.Name).length >
            0
        )
      : installedPackages;
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
            href={`https://access.redhat.com/downloads/content/rhel---${distribution}/x86_64/7416/${packageData?.name}/${packageData?.version}-${packageData?.release}/${packageData?.arch}/fd431d51/package`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="link"
              size="sm"
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

const indexToTabs = {
  0: 'additional',
  1: 'all',
};

const tabsToIndex = {
  additional: 0,
  all: 1,
};

const ImagePackagesTab = ({
  pathPrefix,
  historyProp,
  locationProp,
  navigateProp,
  imageVersion,
}) => {
  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const { pathname } = locationProp ? locationProp() : useLocation();
  const navigate = navigateProp
    ? navigateProp()
    : useNavigate
    ? useNavigate()
    : null;
  let currentPathName = pathname;
  if (pathPrefix && pathname.startsWith(pathPrefix)) {
    // remove the prefix from pathname
    currentPathName = pathname.slice(pathPrefix.length);
  }

  const splitUrl = currentPathName.split('/');
  const defaultToggle = splitUrl.length === 7 ? tabsToIndex[splitUrl[6]] : 1;
  // Distribution examples would be: rhel-86, rhel-90, and rhel-100
  const distribution = imageVersion?.image?.Distribution?.split('-')[1].slice(
    0,
    -1
  );

  const [packageData, setPackageData] = useState({});
  const [toggleTable, setToggleTable] = useState(defaultToggle);

  useEffect(() => {
    setPackageData(imageVersion);
  }, [imageVersion]);

  useEffect(() => {
    splitUrl[5] !== indexToTabs[toggleTable] && setToggleTable(defaultToggle);
  }, [splitUrl]);

  const handleToggleTable = (toggleIndex) => {
    const currentTab = splitUrl[5]?.toLowerCase();
    setToggleTable(toggleIndex);
    if (currentTab === 'packages') {
      if (splitUrl.length === 7) {
        splitUrl[6] = indexToTabs[toggleIndex];
      } else {
        splitUrl.push(indexToTabs[toggleIndex]);
      }
      const url = restorePrefixURL(splitUrl.join('/'), pathPrefix);
      if (navigateProp) {
        navigate(url);
      } else {
        history.push(url);
      }
    }
  };

  return imageVersion?.image?.Commit?.Status === 'SUCCESS' ? (
    <section className="add-100vh pf-l-page__main-section pf-c-page__main-section">
      <GeneralTable
        navigateProp={navigateProp}
        historyProp={historyProp}
        locationProp={locationProp}
        apiFilterSort={false}
        filters={defaultFilters}
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
            ? createRows({
                distribution: distribution,
                installedPackages:
                  packageData?.image?.Commit?.InstalledPackages,
                addedPackages: packageData?.image?.Packages,
                showAll: toggleTable,
              })
            : []
        }
        actionResolver={() => []}
        areActionsDisabled={() => true}
        defaultSort={{ index: 0, direction: 'asc' }}
        toggleButton={[
          { title: 'Additional', key: 0 },
          { title: 'All', key: 1 },
        ]}
        toggleAction={handleToggleTable}
        toggleState={toggleTable}
        emptyFilterState={{
          icon: 'search',
          title: 'No packages to display',
        }}
      />
    </section>
  ) : (
    <section className="add-100vh pf-l-page__main-section pf-c-page__main-section">
      <Empty
        bgColor="white"
        title="Package data currently unavailable"
        body="Packages will be displayed as soon as the image is finished being built."
        primaryAction={null}
        secondaryActions={[]}
      />
    </section>
  );
};

ImagePackagesTab.propTypes = {
  pathPrefix: PropTypes.string,
  historyProp: PropTypes.func,
  locationProp: PropTypes.func,
  navigateProp: PropTypes.func,
  imageVersion: PropTypes.object,
};

export default ImagePackagesTab;
