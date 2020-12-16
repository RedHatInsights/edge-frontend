import React, { useEffect } from 'react';
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Title,
  Bullseye,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { useDispatch } from 'react-redux';
import { loadGroupDevicesInfo } from '../../store/actions';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import { groupDevicesInfoReducer } from '../../store/reducers';

const GroupsInfo = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const registered = getRegistry().register({ groupDevicesInfoReducer });
    dispatch(loadGroupDevicesInfo());
    () => registered();
  }, []);

  return (
    <Grid hasGutter>
      <GridItem span={3}>
        <Card>
          <CardHeader>
            <Title headingLevel="h3">Health threshold</Title>
          </CardHeader>
          <CardBody></CardBody>
        </Card>
      </GridItem>
      <GridItem span={3}>
        <Card>
          <CardHeader>
            <Title headingLevel="h3">Devices info</Title>
          </CardHeader>
          <CardBody></CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card className="edge-groups--detail__complex">
          <CardHeader>
            <Grid>
              <GridItem span={6}>
                <Title headingLevel="h3">Canary parameters</Title>
              </GridItem>
              <GridItem span={6}>
                <Title headingLevel="h3">Last Canaries</Title>
              </GridItem>
            </Grid>
          </CardHeader>
          <CardBody>
            <Grid hasGutter>
              <GridItem span={6}>
                <Title headingLevel="h3">
                  <Bullseye>
                    <TextContent>
                      <Text component={TextVariants.h1}>
                        <Bullseye>10% (89)</Bullseye>
                      </Text>
                      <Text component={TextVariants.h4}>
                        <Bullseye>Of systems tested</Bullseye>
                      </Text>
                    </TextContent>
                  </Bullseye>
                </Title>
              </GridItem>
              <GridItem span={6}></GridItem>
            </Grid>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default GroupsInfo;
