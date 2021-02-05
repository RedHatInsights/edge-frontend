import React, { useEffect, Fragment } from 'react';
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
import PropTypes from 'prop-types';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loadThreshold,
  loadDevicesInfo,
  loadCanariesInfo,
} from '../../store/actions';
import { StatusIcon } from '../../components';
import { ChartPie, ChartThemeColor } from '@patternfly/react-charts';
import { ArrowRightIcon } from '@patternfly/react-icons';

const GroupsInfo = ({ numberOfSystems }) => {
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
  const canariesInfo = useSelector(({ canariesInfoReducer }) =>
    (canariesInfoReducer?.canariesInfo || []).slice(0, 4)
  );
  const isCanariesInfoLoading = useSelector(
    ({ canariesInfoReducer }) => canariesInfoReducer?.isLoading
  );
  useEffect(() => {
    dispatch(loadThreshold());
    dispatch(loadCanariesInfo());
  }, []);

  useEffect(() => {
    dispatch(loadDevicesInfo(numberOfSystems));
  }, [numberOfSystems]);

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
                {isCanariesInfoLoading === true ? (
                  <Spinner />
                ) : (
                  canariesInfo.map(({ group, date, status }, key) => (
                    <Fragment key={group?.uuid || key}>
                      <TextListItem component={TextListItemVariants.dt}>
                        <Link to={`/groups/${group?.uuid}`}>{group?.name}</Link>
                      </TextListItem>
                      <TextListItem component={TextListItemVariants.dd}>
                        <Level>
                          <LevelItem>
                            <DateFormat date={date} />
                          </LevelItem>
                          <LevelItem>
                            <StatusIcon status={status} />
                          </LevelItem>
                        </Level>
                      </TextListItem>
                    </Fragment>
                  ))
                )}
              </TextList>
            </TextContent>
          </CardBody>
          <CardFooter>
            <Split>
              <SplitItem isFilled />
              <SplitItem>
                <Link to="/canaries">
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

GroupsInfo.propTypes = {
  numberOfSystems: PropTypes.number,
};

GroupsInfo.defaultProps = {
  numberOfSystems: 0,
};

export default GroupsInfo;
