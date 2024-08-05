import { ToolbarItem } from '@patternfly/react-core';
import {
  Dropdown,
  DropdownItem,
  KebabToggle,
} from '@patternfly/react-core/deprecated';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const ToolbarKebab = ({ kebabItems }) => {
  const [kebabIsOpen, setKebabIsOpen] = useState(false);

  const dropdownItems = kebabItems.map(
    ({ title, isDisabled, onClick }, index) => (
      <DropdownItem
        key={index}
        onClick={onClick ? onClick : () => {}}
        isDisabled={isDisabled}
      >
        {title}
      </DropdownItem>
    )
  );

  return (
    <ToolbarItem>
      <Dropdown
        toggle={
          <KebabToggle
            aria-label="Actions for selected table items"
            onToggle={() => setKebabIsOpen((prev) => !prev)}
          />
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
