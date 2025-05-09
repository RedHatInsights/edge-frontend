import React, { useState } from 'react';
import {
  Popover,
  Button,
  DescriptionListGroup,
  DescriptionListDescription,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { DescriptionListTermHelpText } from '@patternfly/react-core';
import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import apiWithToast from '../../utils/apiWithToast';
import { updateSystem } from '../../api/devices';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

const FAILURE = 'The playbook failed to run.';
const TIMEOUT = 'The service timed out during the last update.';
const UNRESPONSIVE = 'UNRESPONSIVE';

const popoverDescription = (reason, status, lastSeen) => (
  <div>
    {reason === FAILURE
      ? 'The playbook failed to run. You can retry the update or build a new one.'
      : reason === TIMEOUT
      ? 'The service timed out during the last update. You can retry the update or build a new one.'
      : status === UNRESPONSIVE
      ? 'The service could not be reached via RHC. The system may communicate at a later time if this is a network issue or could be an indication of a more significant problem.'
      : 'Unknown'}
    <Stack className="pf-v5-u-mt-sm">
      <StackItem className="pf-v5-u-font-weight-bold">Last seen</StackItem>
      <StackItem> {<DateFormat date={lastSeen} />}</StackItem>
    </Stack>
  </div>
);

const popoverTitle = (reason, status) => (
  <span className="pf-u-ml-xs">
    {reason === FAILURE
      ? 'Playbook error'
      : reason === TIMEOUT
      ? 'Service timed out'
      : status === UNRESPONSIVE
      ? 'Unresponsive'
      : 'Unknown'}
  </span>
);

const RetryUpdatePopover = ({
  id,
  device,
  position,
  fetchDevices,
  lastSeen,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const statusMessages = {
    onSuccess: {
      variant: 'info',
      title: 'Updating system',
      description: `${device.DeviceName} was added to the queue.`,
    },
  };

  return (
    <DescriptionListGroup>
      <DescriptionListTermHelpText>
        <Popover
          id={id}
          isVisible={isVisible}
          shouldOpen={() => setIsVisible(true)}
          shouldClose={() => setIsVisible(false)}
          aria-label="Alert popover"
          alertseverityvariant="danger"
          headerContent={
            <div style={{ color: '#c9190b' }}>
              <ExclamationCircleIcon size="sm" className="pf-v5-u-mr-xs" />
              {popoverTitle(device.DispatcherReason, device.DispatcherStatus)}
            </div>
          }
          icon="true"
          variant="icon"
          color="red"
          position={position}
          headerComponent="h6"
          bodyContent={popoverDescription(
            device.DispatcherReason,
            device.DispatcherStatus,
            lastSeen
          )}
          footerContent={
            device.DispatcherStatus !== UNRESPONSIVE ? (
              <Button
                variant="link"
                isInline
                onClick={() => {
                  apiWithToast(
                    dispatch,
                    async () => {
                      await updateSystem({
                        DevicesUUID: [device.DeviceUUID],
                      });
                      setIsVisible(false);
                      fetchDevices();
                    },
                    statusMessages
                  );
                }}
              >
                {' '}
                Retry{' '}
              </Button>
            ) : (
              ''
            )
          }
        >
          {children}
        </Popover>
      </DescriptionListTermHelpText>
      <DescriptionListDescription> </DescriptionListDescription>
    </DescriptionListGroup>
  );
};

RetryUpdatePopover.propTypes = {
  id: PropTypes.string,
  lastSeen: PropTypes.string,
  children: PropTypes.element,
  device: PropTypes.object,
  position: PropTypes.string,
  fetchDevices: PropTypes.func,
};

RetryUpdatePopover.defaultProps = {
  position: 'left',
  id: 'retry-update',
};

export default RetryUpdatePopover;
