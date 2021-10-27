import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
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

const dropdownItems = [
  <DropdownItem key="action" component="button">
    Create new version
  </DropdownItem>,
  <DropdownItem key="action" component="button">
    Download instalable .iso for newest image
  </DropdownItem>,
  <DropdownItem key="action" component="button">
    Archive
  </DropdownItem>,
];

const DetailsHead = ({ imageData }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to={paths['manage-images']}>Manage Images</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isActive>{imageData?.Name}</BreadcrumbItem>
      </Breadcrumb>

      <TextContent>
        <Split>
          <SplitItem>
            <TextList component="dl">
              <TextListItem component="h1" className="grid-align-center">
                {imageData?.Name}
              </TextListItem>
              <TextListItem component="dd">
                {imageData?.Status ? (
                  <StatusLabel status={imageData?.Status} />
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
                >
                  Actions
                </DropdownToggle>
              }
              isOpen={isOpen}
              dropdownItems={dropdownItems}
            />
          </SplitItem>
        </Split>
      </TextContent>
    </>
  );
};

DetailsHead.propTypes = {
  imageData: PropTypes.shape({
    ID: PropTypes.number,
    Name: PropTypes.string,
    Status: PropTypes.string,
  }),
};

export default DetailsHead;
