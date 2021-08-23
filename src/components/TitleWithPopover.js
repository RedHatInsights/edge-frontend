import React from 'react';
import { Popover, Button } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

const TitleWithPopover = ({ title, content }) => (
  <>
    <span>{title}</span>
    <Popover
      headerContent={<div>{title}</div>}
      bodyContent={<div>{content}</div>}
    >
      <Button
        variant="plain"
        aria-label={`Action for ${title}`}
        className="ins-active-general_information__popover-icon"
      >
        <OutlinedQuestionCircleIcon />
      </Button>
    </Popover>
  </>
);

export default TitleWithPopover;
