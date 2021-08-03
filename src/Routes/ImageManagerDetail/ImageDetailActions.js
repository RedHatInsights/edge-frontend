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
      listItemClassName="remove-list-style pf-u-mr-lg"
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
      <SplitItem>
        <Button onClick={handleUpdate} variant="secondary">
          Update
        </Button>
        <Dropdown
          position="right"
          onSelect={handleSelect}
          toggle={<KebabToggle onToggle={handleToggle} id="toggle-id-6" />}
          isOpen={isOpen}
          isPlain
          dropdownItems={dropdownItems}
        />
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
