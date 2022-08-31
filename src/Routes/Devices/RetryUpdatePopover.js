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

const RetryUpdatePopover = (props) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const dispatch = useDispatch();
  console.log(props);
  const setUpdateModal = { setUpdateModal };
  console.log(props.deviceUUID);
  const statusMessages = {
    onSuccess: {
      title: 'Success',
      description: ` This Service was added to the queue.`,
    },
    onError: {
      title: 'Error',
      description: 'Updating a device was unsuccessful',
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
              <span className="pf-u-ml-xs"> Error </span>
            </div>
          }
          icon="true"
          varient="icon"
          color="red"
          // headerIcon={alertIcons[alertseverityvariant]}
          headerComponent="h6"
          bodyContent={
            <div>
              Popovers are triggered by click rather than hover.
              <Stack className="pf-u-mt-sm">
                <StackItem className="pf-u-font-weight-bold">
                  Last Seen
                </StackItem>
                <StackItem> {<DateFormat date={props.lastSeen} />}</StackItem>
              </Stack>
            </div>
          }
          footerContent={
            <Button
              variant="link"
              isInline
              onClick={() => {
                apiWithToast(
                  dispatch,
                  () => {
                    updateDeviceLatestImage({
                      deviceUUID: [props.deviceUUID],
                    });
                    setIsVisible(false);
                  },
                  statusMessages
                );
              }}
            >
              {' '}
              Retry{' '}
            </Button>
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
  deviceUUID: PropTypes.array,
  lastSeen: PropTypes.array,
  children: PropTypes.func,
};
