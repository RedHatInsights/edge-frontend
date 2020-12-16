import React from 'react';
import PropTypes from 'prop-types';
import { statusToIcon, statusMapper } from '../constants';
import { UnknownIcon } from '@patternfly/react-icons';

const StatusIcon = ({ status, ...props }) => {
  const Icon = statusToIcon?.[status]?.icon || UnknownIcon;
  return <Icon {...props} color={statusToIcon?.[status]?.color} />;
};

StatusIcon.propTypes = {
  status: PropTypes.oneOf(statusMapper),
};

export default StatusIcon;
