import React from 'react';
import { Label } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import {
  composeStatus,
  statusIcons,
  statusColors,
  imageStatusMapper,
  labelVariant,
} from './constants';

const StatusLabel = ({ status }) => {
  let icon = statusIcons['unknown'];
  let color = statusColors['unknown'];
  let text = 'Unknown';
  if (composeStatus.includes(status)) {
    icon = statusIcons[status];
    color = statusColors[status];
    text = imageStatusMapper[status];
    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  }
  return (
    <div className="label-container">
      <Label
        className="force-label-no-border"
        color={color}
        icon={icon}
        variant={labelVariant}
      />
      <p>{text}</p>
    </div>
  );
};

StatusLabel.propTypes = {
  status: PropTypes.oneOf(composeStatus),
};

export default StatusLabel;
