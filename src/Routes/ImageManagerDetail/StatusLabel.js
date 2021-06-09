import React from 'react';
import { Label } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { composeStatus, statusIcons, statusColors } from './constants';

const StatusLabel = ({ status }) => {
  let icon = statusIcons['unknown'];
  let color = statusColors['unknown'];
  let text = 'Unknown';
  if (composeStatus.includes(status)) {
    icon = statusIcons[status];
    color = statusColors[status];
    text = status.charAt(0).toUpperCase() + status.slice(1);
  }
  return (
    <Label color={color} icon={icon}>
      {text}
    </Label>
  );
};

StatusLabel.propTypes = {
  status: PropTypes.oneOf(composeStatus),
};

export default StatusLabel;
