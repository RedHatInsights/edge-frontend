import React from 'react';
import PropTypes from 'prop-types';
import { statusToIcon, statusMapper } from '../constants';
import { UnknownIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';

const StatusIcon = ({ status, ...props }) => {
  const Icon = statusToIcon?.[status]?.icon || UnknownIcon;
  return (
    <Tooltip content={statusToIcon?.[status]?.title}>
      <Icon {...props} color={statusToIcon?.[status]?.color} />
    </Tooltip>
  );
};

StatusIcon.propTypes = {
  status: PropTypes.oneOf(statusMapper),
};

export default StatusIcon;
