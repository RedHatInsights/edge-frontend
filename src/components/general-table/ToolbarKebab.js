import {
  Dropdown,
  DropdownItem,
  ToolbarItem,
  KebabToggle,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ToolbarKebab = ({ kebabItems }) => {
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = kebabItems.map(({ title, onClick }, index) => (
    <DropdownItem key={index} onClick={onClick ? onClick : () => {}}>
      {title}
    </DropdownItem>
  ));

  return (
    <ToolbarItem>
      <Dropdown
        toggle={
          <KebabToggle onToggle={() => setKebabIsOpen((prev) => !prev)} />
        }
        isOpen={kebabIsOpen}
        isPlain
        dropdownItems={dropdownItems}
      />
    </ToolbarItem>
  );
};

ToolbarKebab.propTypes = {
  kebabItems: PropTypes.array,
};

export default ToolbarKebab;
