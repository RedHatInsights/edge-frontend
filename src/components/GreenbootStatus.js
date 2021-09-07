import React from 'react';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-circle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import PropTypes from 'prop-types';

const GreenbootStatus = ({ status }) => {
  if (status === 'green') {
    return (
      <>
        <CheckCircleIcon color="green" className="pf-u-mr-sm" />
        <span className="pf-u-success-color-200">Passed</span>
      </>
    );
  }

  if (status === 'red') {
    return (
      <>
        <ExclamationCircleIcon color="red" className="pf-u-mr-sm" />
        <span className="pf-u-danger-color-200">Failed and reverted</span>
      </>
    );
  }
  return (
    <>
      <InProgressIcon className="pf-u-mr-sm" />
      <span>Waiting for update</span>
    </>
  );
};

GreenbootStatus.propTypes = {
  status: PropTypes.string,
};

export default GreenbootStatus;
