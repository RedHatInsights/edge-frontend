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
  Level,
  LevelItem,
  CardFooter,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadThreshold,
  loadDevicesInfo,
  loadCanariesInfo,
} from '../../store/actions';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/esm/Registry';
import {
  thresholdReducer,
  devicesInfoReducer,
  canariesInfoReducer,
} from '../../store/reducers';
import { StatusIcon } from '../../components';
import { ChartPie, ChartThemeColor } from '@patternfly/react-charts';
import { ArrowRightIcon } from '@patternfly/react-icons';

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
  const canariesInfo = useSelector(
    ({ canariesInfoReducer }) => canariesInfoReducer?.canariesInfo || {}
  );
  const isCanariesInfoLoading = useSelector(
    ({ canariesInfoReducer }) => canariesInfoReducer?.isLoading
  );
  useEffect(() => {
    const registered = getRegistry().register({
      thresholdReducer,
      devicesInfoReducer,
      canariesInfoReducer,
    });
    dispatch(loadThreshold());
    dispatch(loadDevicesInfo());
    dispatch(loadCanariesInfo());
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
          <CardHeader>
            <Title headingLevel="h3">Last Canaries</Title>
          </CardHeader>
          <CardBody>
            <TextContent>
              <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>
                  <Link to="/groups">Sensors</Link>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {isCanariesInfoLoading === false ? (
                    <Level>
                      <LevelItem>
                        <DateFormat date={canariesInfo?.sensors?.time} />
                      </LevelItem>
                      <LevelItem>
                        <StatusIcon status={canariesInfo?.sensors?.status} />
                      </LevelItem>
                    </Level>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  <Link to="/groups">Scanners</Link>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {isCanariesInfoLoading === false ? (
                    <Level>
                      <LevelItem>
                        <DateFormat date={canariesInfo?.scanners?.time} />
                      </LevelItem>
                      <LevelItem>
                        <StatusIcon status={canariesInfo?.scanners?.status} />
                      </LevelItem>
                    </Level>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  <Link to="/groups">Kiosks</Link>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {isCanariesInfoLoading === false ? (
                    <Level>
                      <LevelItem>
                        <DateFormat date={canariesInfo?.kiosks?.time} />
                      </LevelItem>
                      <LevelItem>
                        <StatusIcon status={canariesInfo?.kiosks?.status} />
                      </LevelItem>
                    </Level>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  <Link to="/groups">Antenna</Link>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  {isCanariesInfoLoading === false ? (
                    <Level>
                      <LevelItem>
                        <DateFormat date={canariesInfo?.antenna?.time} />
                      </LevelItem>
                      <LevelItem>
                        <StatusIcon status={canariesInfo?.antenna?.status} />
                      </LevelItem>
                    </Level>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
              </TextList>
            </TextContent>
          </CardBody>
          <CardFooter>
            <Split>
              <SplitItem isFilled />
              <SplitItem>
                <Link to="/groups">
                  See canaries <ArrowRightIcon />
                </Link>
              </SplitItem>
            </Split>
          </CardFooter>
        </Card>
      </GridItem>
    </Grid>
  );
};

export default GroupsInfo;
