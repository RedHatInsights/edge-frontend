import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Text,
  Button,
  SplitItem,
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core';

const ImageActions = ({ imageData, openUpdateWizard }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownItems = [
    <DropdownItem
      href={imageData?.Installer?.ImageBuildISOURL}
      key="link"
    >
      <Text className="force-text-black">Download</Text>
    </DropdownItem>,
  ];

  const handleToggle = (isOpen) => setIsOpen(isOpen);

  const handleSelect = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleUpdate = () => {
    openUpdateWizard(imageData.ID);
  };

  return (
    <>
      <SplitItem>
        <Button onClick={handleUpdate} variant="secondary">
          Update
        </Button>
        {imageData.Installer.ImageBuildISOURL ? 
          <Dropdown
            position="right"
            onSelect={handleSelect}
            toggle={<KebabToggle onToggle={handleToggle} id="image-detail-kebab" />}
            isOpen={isOpen}
            isPlain
            dropdownItems={dropdownItems}
          />
        : null}
      </SplitItem>
    </>
  );
};

ImageActions.propTypes = {
  openUpdateWizard: PropTypes.func,
  imageData: PropTypes.shape({
    ID: PropTypes.number,
    Name: PropTypes.string,
    Status: PropTypes.string,
  }),
};

export default ImageActions;
