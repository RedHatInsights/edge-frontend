import React, { useState } from 'react';
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
  Button,
  Split,
  SplitItem,
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core';
import StatusLabel from './StatusLabel';
import { routes as paths } from '../../../package.json';

const DetailsHead = ({ imageData, openUpdateWizard }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem
      listItemClassName="remove-list-style"
      href={imageData?.Installer?.ImageBuildISOURL}
      key="link"
    >
      <Text className="force-text-black">Download</Text>
    </DropdownItem>,
  ];

  const handleToggle = (isOpen) => setIsOpen(isOpen);

  const handleSelect = () => {
    setIsOpen((prevState) => !prevState);
    onFocus();
  };

  const onFocus = () => {
    const element = document.getElementById('toggle-id-6');
    element.focus();
  };

  const handleUpdate = () => {
    openUpdateWizard(imageData.ID);
  };

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
          {imageData?.Status === 'SUCCESS' ? (
            <SplitItem>
              <Button onClick={handleUpdate} variant="secondary">
                Update
              </Button>
              <Dropdown
                position="right"
                onSelect={handleSelect}
                toggle={
                  <KebabToggle onToggle={handleToggle} id="toggle-id-6" />
                }
                isOpen={isOpen}
                isPlain
                dropdownItems={dropdownItems}
              />
            </SplitItem>
          ) : null}
        </Split>
      </TextContent>
    </>
  );
};

DetailsHead.propTypes = {
  openUpdateWizard: PropTypes.func,
  imageData: PropTypes.shape({
    ID: PropTypes.number,
    Name: PropTypes.string,
    Status: PropTypes.string,
  }),
};

export default DetailsHead;
