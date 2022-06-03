import React from 'react';
import PropTypes from 'prop-types';
import { Label, Tooltip, Split, SplitItem } from '@patternfly/react-core';
import { statusMapper } from '../constants/status';

const Status = ({ type, isLabel = false, toolTipContent = '' }) => {
  const { text, Icon, color, labelColor } =
    Object.prototype.hasOwnProperty.call(statusMapper, type)
      ? statusMapper[type]
      : statusMapper['default'];

  return (
    <>
      {isLabel ? (
        <Label color={labelColor} icon={<Icon />}>
          {text}
        </Label>
      ) : (
        <Split style={{ color }}>
          <SplitItem className="pf-u-mr-sm">
            {toolTipContent ? (
              <Tooltip content="blargh">
                <Icon />
              </Tooltip>
            ) : (
              <Icon />
            )}
          </SplitItem>
          <SplitItem>
            <p>{text}</p>
          </SplitItem>
        </Split>
      )}
    </>
  );
};

export default Status;

Status.propTypes = {
  type: PropTypes.string,
  isLabel: PropTypes.bool,
  toolTipContent: PropTypes.string,
};
