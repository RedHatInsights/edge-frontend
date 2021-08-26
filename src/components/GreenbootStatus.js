import React from 'react';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import PropTypes from 'prop-types';

const GreenbootStatus = ({ status }) => {
  if (status === 'green') {
    return (
      <>
        <CheckCircleIcon color="green" /> Success
      </>
    );
  }

  if (status === 'red') {
    return (
      <>
        <ExclamationCircleIcon color="red" /> Failed
      </>
    );
  }
  return (
    <>
      <ExclamationCircleIcon color="red" /> Unknown
    </>
  );
};

GreenbootStatus.propTypes = {
  status: PropTypes.string,
};

export default GreenbootStatus;
