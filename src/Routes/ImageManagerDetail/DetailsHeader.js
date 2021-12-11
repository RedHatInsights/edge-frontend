import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Text,
  TextList,
  TextListItem,
  TextContent,
  Skeleton,
  Breadcrumb,
  BreadcrumbItem,
  Split,
  SplitItem,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownPosition,
} from '@patternfly/react-core';
import StatusLabel from './StatusLabel';
import { routes as paths } from '../../../package.json';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';

const dropdownItems = (data, imageVersion, openUpdateWizard) => {
  const imageData = imageVersion
    ? data
    : data?.Images?.[data?.Images?.length - 1];
  const actionsArray = [];

  imageData?.ID &&
    actionsArray.push(
      <DropdownItem
        key="create-new-version-button"
        component="button"
        onClick={() => openUpdateWizard(imageData?.ID)}
      >
        Create new version
      </DropdownItem>
    );

  imageData?.Installer?.ImageBuildISOURL &&
    actionsArray.push(
      <DropdownItem key="download-button" component="button">
        <Text
          className="force-text-black remove-underline"
          component="a"
          href={imageData?.Installer?.ImageBuildISOURL}
          rel="noopener noreferrer"
          target="_blank"
        >
          Download installable .iso for newest image
        </Text>
      </DropdownItem>
    );
  return actionsArray;
};

const DetailsHead = ({ imageData, imageVersion, openUpdateWizard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    setData(imageData?.data?.Data);
  }, [imageData]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to={paths['manage-images']}>Manage Images</Link>
        </BreadcrumbItem>
        {imageVersion ? (
          <BreadcrumbItem>
            <Link to={`${paths['manage-images']}/${data?.image_set?.ID}`}>
              {data?.image_set?.Name}
            </Link>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem isActive>{data?.image_set?.Name}</BreadcrumbItem>
        )}
        {imageVersion && (
          <BreadcrumbItem isActive>
            {imageVersion?.image?.Version}
          </BreadcrumbItem>
        )}
      </Breadcrumb>

      <TextContent>
        <Split>
          <SplitItem>
            <TextList component="dl">
              <TextListItem component="h1" className="grid-align-center">
                {data?.image_set?.Name}
              </TextListItem>
              <TextListItem component="dd">
                {data?.Status ||
                data?.images?.[data?.images?.length - 1]?.image?.Status ? (
                  <StatusLabel
                    status={
                      data?.images?.[data?.images?.length - 1]?.image?.Status
                    }
                  />
                ) : (
                  <Skeleton />
                )}
              </TextListItem>
            </TextList>
          </SplitItem>
          <SplitItem isFilled></SplitItem>
          <SplitItem>
            <Dropdown
              position={DropdownPosition.right}
              toggle={
                <DropdownToggle
                  id="image-set-details-dropdown"
                  toggleIndicator={CaretDownIcon}
                  onToggle={(newState) => setIsOpen(newState)}
                  isDisabled={
                    (imageVersion
                      ? imageVersion?.image?.Status
                      : data?.Images?.[data?.Images?.length - 1]?.Status) ===
                      'BUILDING' || false
                  }
                >
                  Actions
                </DropdownToggle>
              }
              isOpen={isOpen}
              dropdownItems={dropdownItems(
                data,
                imageVersion,
                openUpdateWizard
              )}
            />
          </SplitItem>
        </Split>
      </TextContent>
    </>
  );
};

DetailsHead.propTypes = {
  imageData: PropTypes.object,
  imageVersion: PropTypes.object,
  openUpdateWizard: PropTypes.func,
};

export default DetailsHead;
