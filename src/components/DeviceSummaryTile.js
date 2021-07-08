import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  Button,
  Bullseye,
  Spinner,
  Grid,
  GridItem,
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
    <CardTitle>Device summary</CardTitle>
    <CardBody>
      <Grid>
        <GridItem span={6}>
          <Stack hasGutter>
            <StackItem>
              <Button isInline className="pf-u-pr-md" variant="link">
                {active}
              </Button>{' '}
              Active
            </StackItem>
            <StackItem>
              <Button isInline className="pf-u-pr-md" variant="link">
                {orphaned}
              </Button>{' '}
              Orphaned
            </StackItem>
          </Stack>
        </GridItem>
        <GridItem span={6}>
          <Stack hasGutter>
            <StackItem>
              <Button isInline className="pf-u-pr-md" variant="link">
                {noReports}
              </Button>
              Stale
            </StackItem>
            <StackItem>
              <Button isInline className="pf-u-pr-md" variant="link">
                {neverReported}
              </Button>
              Registered but never reported
            </StackItem>
          </Stack>
        </GridItem>
      </Grid>
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
