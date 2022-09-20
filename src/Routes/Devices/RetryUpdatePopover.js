import React from 'react';
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
import { updateDeviceLatestImage } from '../../api/devices';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

function getDevicePopoverDescription(props) {
  if (props.device.DispatcherReason === 'The playbook failed to run.') {
    return (
      <div>
        The playbook failed to run. You can retry the update or build a new one.
        <Stack className="pf-u-mt-sm">
          <StackItem className="pf-u-font-weight-bold">Last seen</StackItem>
          <StackItem> {<DateFormat date={props.lastSeen} />}</StackItem>
        </Stack>
      </div>
    );
  }
  if (
    props.device.DispatcherReason ===
    'The service timed out during the last update.'
  ) {
    return (
      <div>
        The service timed out during the last update. You can retry the update
        or build a new one.
        <Stack className="pf-u-mt-sm">
          <StackItem className="pf-u-font-weight-bold">Last seen</StackItem>
          <StackItem> {<DateFormat date={props.lastSeen} />}</StackItem>
        </Stack>
      </div>
    );
  }

  if (props.device.DispatcherStatus === 'UNRESPONSIVE') {
    return (
      <div>
        The service could not be reached via RHC. The device may communicate at
        a later time if this is a network issue or could be an indication of a
        more significant problem.
        <Stack className="pf-u-mt-sm">
          <StackItem className="pf-u-font-weight-bold">Last Seen</StackItem>
          <StackItem> {<DateFormat date={props.lastSeen} />}</StackItem>
        </Stack>
      </div>
    );
  }
}

function getDevicePopoverTitle(props) {
  if (props.device.DispatcherReason === 'The playbook failed to run.') {
    return <span className="pf-u-ml-xs"> Playbook error </span>;
  }

  if (
    props.device.DispatcherReason ===
    'The service timed out during the last update.'
  ) {
    return <span className="pf-u-ml-xs"> Service timed-out </span>;
  }

  if (props.device.DispatcherStatus === 'UNRESPONSIVE') {
    return <span className="pf-u-ml-xs"> Unresponsive </span>;
  }
}

const RetryUpdatePopover = (props) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const dispatch = useDispatch();
  props;
  const isMounted = React.useRef(true);
  React.useEffect(() => {
    if (isMounted.current) {
      return () => {
        isMounted.current = false;
      };
    }
  });
  props.DeviceUUID;
  const setUpdateModal = { setUpdateModal };
  const statusMessages = {
    onSuccess: {
      variant: 'info',
      title: 'Updating system',
      description: `${props.device.DeviceName} was added to the queue.`,
    },
  };

  return (
    <DescriptionListGroup>
      <DescriptionListTermHelpText>
        <Popover
          isVisible={isVisible}
          shouldOpen={() => setIsVisible(true)}
          shouldClose={() => setIsVisible(false)}
          aria-label="Alert popover"
          alertseverityvariant={'danger'}
          headerContent={
            <div style={{ color: '#c9190b' }}>
              {' '}
              <ExclamationCircleIcon size="sm" />
              {getDevicePopoverTitle(props)}
            </div>
          }
          icon="true"
          varient="icon"
          color="red"
          position={props.position ? props.position : 'left'}
          headerComponent="h6"
          bodyContent={getDevicePopoverDescription(props)}
          footerContent={
            props.device.DispatcherStatus !== 'UNRESPONSIVE' ? (
              <Button
                variant="link"
                isInline
                onClick={() => {
                  apiWithToast(
                    dispatch,
                    async () => {
                      await updateDeviceLatestImage({
                        DevicesUUID: [props.device.DeviceUUID],
                      });
                      setIsVisible(false);
                      props.fetchDevices();
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
          {props.children}
        </Popover>
      </DescriptionListTermHelpText>
      <DescriptionListDescription> </DescriptionListDescription>
    </DescriptionListGroup>
  );
};
export default RetryUpdatePopover;

RetryUpdatePopover.propTypes = {
  deviceUUID: PropTypes.string,
  lastSeen: PropTypes.string,
  children: PropTypes.object,
  device: PropTypes.object,
  DeviceUUID: PropTypes.string,
  position: PropTypes.string,
  fetchDevices: PropTypes.func,
};
