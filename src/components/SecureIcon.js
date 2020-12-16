import React from 'react';
import PropTypes from 'prop-types';
import { LockIcon, LockOpenIcon } from '@patternfly/react-icons';

const SecureIcon = ({ isSecure, ...props }) => {
  const Icon = isSecure ? LockIcon : LockOpenIcon;
  return <Icon {...props} />;
};

SecureIcon.propTypes = {
  isSecure: PropTypes.bool,
};

SecureIcon.defaultProps = {
  isSecure: false,
};

export default SecureIcon;
