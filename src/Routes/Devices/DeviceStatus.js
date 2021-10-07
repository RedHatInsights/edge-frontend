import React from 'react';
import { Split, SplitItem } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import InProgressIcon from '@patternfly/react-icons/dist/js/icons/in-progress-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/question-circle-icon';
import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';
import infoColor from '@patternfly/react-tokens/dist/esm/global_active_color_300';
import PropTypes from 'prop-types';

const DeviceStatus = ({ imageData, rpm_ostree_deployments }) => {
  const { UpdateTransactions, ImageInfo } = imageData || {};
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

  if (
    UpdateTransactions?.[UpdateTransactions.length - 1].Status === 'BUILDING' ||
    UpdateTransactions?.[UpdateTransactions.length - 1].Status === 'CREATED'
  ) {
    return (
      <Split>
        <SplitItem className="pf-u-mr-sm">
          <InProgressIcon color={infoColor.value} />
        </SplitItem>
        <SplitItem>Updating</SplitItem>
      </Split>
    );
  }

  if (ImageInfo?.UpdatesAvailable?.length > 0) {
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
  updateTransactions: PropTypes.array,
  rpm_ostree_deployments: PropTypes.array,
  imageData: PropTypes.object,
};

export default DeviceStatus;
