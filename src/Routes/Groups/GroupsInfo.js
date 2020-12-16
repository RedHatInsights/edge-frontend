import React, { useEffect } from 'react';
import {
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Bullseye,
  Spinner,
  Title,
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
  Skeleton,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadThreshold, loadDevicesInfo } from '../../store/actions';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import { thresholdReducer, devicesInfoReducer } from '../../store/reducers';
import { ChartPie, ChartThemeColor } from '@patternfly/react-charts';

const GroupsInfo = () => {
  const dispatch = useDispatch();
  const threshold = useSelector(
    ({ thresholdReducer }) => thresholdReducer?.threshold || {}
  );
  const isThresholdLoading = useSelector(
    ({ thresholdReducer }) => thresholdReducer?.isLoading
  );
  const isDevicesInfoLoading = useSelector(
    ({ devicesInfoReducer }) => devicesInfoReducer?.isLoading
  );
  const devicesInfo = useSelector(
    ({ devicesInfoReducer }) => devicesInfoReducer?.devicesInfo || {}
  );
  useEffect(() => {
    const registered = getRegistry().register({
      thresholdReducer,
      devicesInfoReducer,
    });
    dispatch(loadThreshold());
    dispatch(loadDevicesInfo());
    () => registered();
  }, []);

  return (
    <Grid hasGutter>
      <GridItem span={3}>
        <Card>
          <CardHeader>
            <Title headingLevel="h3">Health threshold</Title>
          </CardHeader>
          <CardBody>
            {isThresholdLoading === false ? (
              <ChartPie
                ariaDesc="Health threshold"
                ariaTitle="Health threshold"
                constrainToVisibleArea={true}
                legendOrientation="vertical"
                legendPosition="right"
                height={230}
                width={450}
                data={threshold.map((item) => ({
                  x: Object.keys(item)?.[0],
                  y: Object.values(item)?.[0],
                }))}
                legendData={threshold.map((item) => ({
                  name: `${Object.keys(item)?.[0]}: ${
                    Object.values(item)?.[0]
                  }`,
                }))}
                padding={{
                  bottom: 20,
                  left: 20,
                  right: 140, // Adjusted to accommodate legend
                  top: 20,
                }}
                labels={({ datum }) => `${datum.x}: ${datum.y}`}
                themeColor={ChartThemeColor.multiOrdered}
              />
            ) : (
              <Bullseye>
                <Spinner />
              </Bullseye>
            )}
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={3}>
        <Card>
          <CardHeader>
            <Title headingLevel="h3">Devices info</Title>
          </CardHeader>
          <CardBody>
            <TextContent>
              <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>
                  {isDevicesInfoLoading === false ? (
                    <Text component={TextVariants.h1}>
                      <Link to="/groups">{devicesInfo?.requiredApproval}</Link>
                    </Text>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  Required approvals
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {isDevicesInfoLoading === false ? (
                    <Text component={TextVariants.h1}>
                      <Link to="/groups">{devicesInfo?.orphaned}</Link>
                    </Text>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  Orphaned devices
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {isDevicesInfoLoading === false ? (
                    <Text component={TextVariants.h1}>
                      <Link to="/groups">{devicesInfo?.delivering}</Link>
                    </Text>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  Devices on the way
                </TextListItem>
              </TextList>
            </TextContent>
          </CardBody>
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
