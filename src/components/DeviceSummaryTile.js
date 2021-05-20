import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Bullseye,
  Spinner,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

const DeviceSummaryTileBase = ({
  orphaned,
  active,
  noReports,
  neverReported,
}) => (
  <Card className="tiles-card">
    <CardTitle>Device summary information</CardTitle>
    <CardBody>
      <Stack>
        <StackItem>
          <Button variant="link">{orphaned}</Button> orphaned devices
        </StackItem>
        <StackItem>
          <Button variant="link">{active}</Button> active devices
        </StackItem>
        <StackItem>
          <Button variant="link">{noReports}</Button> devices has not reported
          in the last 6 months
        </StackItem>
        <StackItem>
          <Button variant="link">{neverReported}</Button> devices were
          registered but never reported
        </StackItem>
      </Stack>
    </CardBody>
  </Card>
);

DeviceSummaryTileBase.propTypes = {
  orphaned: PropTypes.number,
  active: PropTypes.number,
  noReports: PropTypes.number,
  neverReported: PropTypes.number,
};

const DeviceSummaryTile = () => {
  const { isLoading, hasError, data } = useSelector(
    ({ deviceSummaryReducer }) => ({
      isLoading:
        deviceSummaryReducer?.isLoading !== undefined
          ? deviceSummaryReducer?.isLoading
          : true,
      hasError: deviceSummaryReducer?.hasError || false,
      data: deviceSummaryReducer?.data || null,
    }),
    shallowEqual
  );

  if (isLoading) {
    return (
      <Card className="tiles-card">
        <CardTitle>Device summary information</CardTitle>
        <CardBody>
          <Bullseye>
            <Spinner />
          </Bullseye>
        </CardBody>
      </Card>
    );
  }
  if (hasError) {
    return (
      <Card className="tiles-card">
        <CardTitle>Device summary information</CardTitle>
        <CardBody>{data}</CardBody>
      </Card>
    );
  }
  return (
    <DeviceSummaryTileBase
      orphaned={data['orphaned']}
      active={data['active']}
      noReports={data['noReports']}
      neverReported={data['neverReported']}
    />
  );
};

export default DeviceSummaryTile;
