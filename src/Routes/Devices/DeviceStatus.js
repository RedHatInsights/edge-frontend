import React from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import PropTypes from 'prop-types';

const DeviceStatus = ({ systemProfile }) => {
  console.debug('system profile is', systemProfile);
  const { rpm_ostree_deployments } = systemProfile;
  if (rpm_ostree_deployments?.length === undefined) {
    return (
      <Split>
        <SplitItem className="pf-u-mr-sm">
          <QuestionCircleIcon color="grey" />
        </SplitItem>
        <SplitItem>Unspecified</SplitItem>
      </Split>
    );
  }
  const current_deployment = rpm_ostree_deployments[0];
  if (!current_deployment.booted) {
    return (
      <Split>
        <SplitItem className="pf-u-mr-sm">
          <InProgressIcon color="blue" />
        </SplitItem>
        <SplitItem>Booting</SplitItem>
      </Split>
    );
  }
  return (
    <Split>
      <SplitItem className="pf-u-mr-sm">
        <CheckCircleIcon color="green" />
      </SplitItem>
      <SplitItem>Running</SplitItem>
    </Split>
  );
};

DeviceStatus.propTypes = {
  systemProfile: PropTypes.shape({
    rpm_ostree_deployments: PropTypes.arrayOf(
      PropTypes.shape({
        booted: PropTypes.bool,
        checksum: PropTypes.string,
      })
    ),
  }).isRequired,
};

export default DeviceStatus;
