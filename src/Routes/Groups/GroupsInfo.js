import React from 'react';
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
} from '@patternfly/react-core';

const GroupsInfo = () => {
  return (
    <Grid hasGutter>
      <GridItem span={3}>
        <Card>
          <CardHeader>Health threshold Visualization</CardHeader>
          <CardBody></CardBody>
        </Card>
      </GridItem>
      <GridItem span={3}>
        <Card>
          <CardHeader>Devices info</CardHeader>
          <CardBody></CardBody>
        </Card>
      </GridItem>
      <GridItem span={3}>
        <Card>
          <CardHeader>Last Canaries</CardHeader>
          <CardBody></CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default GroupsInfo;
