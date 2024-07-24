import React, { useEffect, useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import { createLink } from '../../utils';
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
  Tooltip,
} from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownPosition,
} from '@patternfly/react-core/deprecated';
import Status from '../../components/Status';
import { routes as paths } from '../../constants/routeMapper';
import CaretDownIcon from '@patternfly/react-icons/dist/esm/icons/caret-down-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { getBaseURLFromPrefixAndName } from './utils';

const dropdownItems = (data, imageVersion, isoURL, openUpdateWizard) => {
  const imageData = imageVersion ? imageVersion : data?.LastImageDetails;

  const actionsArray = [];

  imageData?.image?.ID &&
    actionsArray.push(
      <DropdownItem
        key="create-new-version-button"
        component="button"
        onClick={() => openUpdateWizard(imageData?.image?.ID)}
      >
        Create new version
      </DropdownItem>
    );

  isoURL &&
    actionsArray.push(
      <DropdownItem key="download-button" component="button">
        <Text
          className="force-text-black remove-underline"
          component="a"
          href={isoURL}
          rel="noopener noreferrer"
          target="_blank"
        >
          Download installable .iso for newest image
        </Text>
      </DropdownItem>
    );
  return actionsArray;
};

const DetailsHead = ({
  pathPrefix,
  urlName,
  historyProp,
  navigateProp,
  imageData,
  imageVersion,
  openUpdateWizard,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({});

  const history = historyProp
    ? historyProp()
    : useHistory
    ? useHistory()
    : null;
  const navigate = navigateProp
    ? navigateProp()
    : useNavigate
    ? useNavigate()
    : null;

  useEffect(() => {
    setData(imageData?.data);
  }, [imageData]);

  const actionsLabel = 'Actions for image set details view';
  const dropdownId = 'image-set-details-dropdown';
  const baseURL = getBaseURLFromPrefixAndName(
    `edge${paths.manageImages}`,
    pathPrefix,
    urlName
  );

  return (
    <>
      {!imageData.isLoading && imageData.hasError ? (
        <Breadcrumb>
          <BreadcrumbItem>
            {createLink({
              pathname: baseURL,
              linkText: 'Back to Manage Images',
              history,
              navigate,
            })}
          </BreadcrumbItem>
        </Breadcrumb>
      ) : (
        <>
          <Breadcrumb>
            <BreadcrumbItem>
              {createLink({
                pathname: baseURL,
                linkText: 'Manage Images',
                history,
                navigate,
              })}
            </BreadcrumbItem>
            {imageVersion ? (
              <BreadcrumbItem>
                {createLink({
                  pathname: `${baseURL}/${data?.ImageSet?.ID}`,
                  linkText: data?.ImageSet?.Name,
                  history,
                  navigate,
                })}
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem isActive>
                {data?.ImageSet?.Name || <Skeleton width="100px" />}
              </BreadcrumbItem>
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
                  <TextListItem
                    component="h1"
                    className="grid-align-center pf-u-mb-0"
                  >
                    {data?.ImageSet?.Name || <Skeleton width="150px" />}
                  </TextListItem>
                  <TextListItem className="pf-u-pt-sm" component="dd">
                    {imageVersion?.image?.Status ||
                    data?.LastImageDetails?.image?.Status ? (
                      <Status
                        type={
                          imageVersion
                            ? imageVersion?.image?.Status.toLowerCase()
                            : data?.LastImageDetails?.image?.Status.toLowerCase()
                        }
                      />
                    ) : (
                      <Skeleton width="100px" />
                    )}
                  </TextListItem>
                  {imageVersion?.image?.UpdatedAt ||
                  data?.LastImageDetails?.image?.UpdatedAt ? (
                    <TextListItem component="p">
                      {`Last updated `}
                      <DateFormat
                        date={
                          imageVersion
                            ? imageVersion?.image?.UpdatedAt
                            : data?.LastImageDetails?.image?.UpdatedAt
                        }
                      />
                    </TextListItem>
                  ) : (
                    <Skeleton width="200px" />
                  )}
                </TextList>
              </SplitItem>
              <SplitItem isFilled></SplitItem>
              <SplitItem>
                <Dropdown
                  position={DropdownPosition.right}
                  toggle={
                    <DropdownToggle
                      id={dropdownId}
                      toggleIndicator={CaretDownIcon}
                      onToggle={(_event, newState) => setIsOpen(newState)}
                      isDisabled={
                        (imageVersion
                          ? imageVersion?.image?.Status
                          : data?.LastImageDetails?.image.Status) ===
                          'BUILDING' || false
                      }
                      aria-label={actionsLabel}
                    >
                      <Tooltip
                        content={actionsLabel}
                        triggerRef={() => document.getElementById(dropdownId)}
                      />
                      Actions
                    </DropdownToggle>
                  }
                  isOpen={isOpen}
                  dropdownItems={dropdownItems(
                    data,
                    imageVersion,
                    data?.ImageBuildIsoURL,
                    openUpdateWizard
                  )}
                />
              </SplitItem>
            </Split>
          </TextContent>
        </>
      )}
    </>
  );
};

DetailsHead.propTypes = {
  pathPrefix: PropTypes.string,
  urlName: PropTypes.string,
  historyProp: PropTypes.func,
  navigateProp: PropTypes.func,
  imageData: PropTypes.object,
  imageVersion: PropTypes.object,
  openUpdateWizard: PropTypes.func,
};

export default DetailsHead;
