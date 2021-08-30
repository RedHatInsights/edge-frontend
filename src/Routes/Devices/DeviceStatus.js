import React, { useEffect, useState } from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
import { getDeviceHasUpdate } from '../../api/index';
import PropTypes from 'prop-types';

const DeviceStatus = ({ id, systemProfile }) => {
  const [status, setStatus] = useState(undefined);
  useEffect(() => {
    (async () => {
      const imageInfo = (await getDeviceHasUpdate(id)) || { data: null };
      setStatus(
        Object.prototype.hasOwnProperty.call(imageInfo, 'data')
          ? null
          : imageInfo
      );
    })();
  }, []);
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
  if (status !== null && status !== undefined) {
    return (
      <Split>
        <SplitItem className="pf-u-mr-sm">
          <ExclamationTriangleIcon color={warningColor.value} />
        </SplitItem>
        <SplitItem className="pf-u-warning-color-200">
          Update Available
        </SplitItem>
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
  id: PropTypes.string,
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
