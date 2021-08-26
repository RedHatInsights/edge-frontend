import React from 'react';
import { Popover, Button } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

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

TitleWithPopover.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

export default TitleWithPopover;
