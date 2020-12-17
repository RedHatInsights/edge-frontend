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
  TextListItem,
  Skeleton,
  TextListItemVariants,
  TextList,
  TextListVariants,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { loadGroupDevicesInfo } from '../../store/actions';

const GroupsInfo = ({ uuid }) => {
  const dispatch = useDispatch();
  const isDevicesInfoLoading = useSelector(
    ({ groupDevicesInfoReducer }) => groupDevicesInfoReducer?.isLoading
  );
  const devicesInfo = useSelector(
    ({ groupDevicesInfoReducer }) => groupDevicesInfoReducer?.devicesInfo
  );
  useEffect(() => {
    dispatch(loadGroupDevicesInfo());
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
          <CardBody>
            <TextContent>
              <TextList component={TextListVariants.dl}>
                <TextListItem component={TextListItemVariants.dt}>
                  {isDevicesInfoLoading === false ? (
                    <Text component={TextVariants.h1}>
                      {devicesInfo?.total}
                    </Text>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  <Text component={TextVariants.h3}>Total devices</Text>
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {isDevicesInfoLoading === false ? (
                    <Text component={TextVariants.h1}>
                      <Link to={`/groups/${uuid}`}>
                        {devicesInfo?.newDevices}
                      </Link>
                    </Text>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  New devices added
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {isDevicesInfoLoading === false ? (
                    <Text component={TextVariants.h1}>
                      <Link to={`/groups/${uuid}`}>
                        {devicesInfo?.offlineDevices}
                      </Link>
                    </Text>
                  ) : (
                    <Skeleton />
                  )}
                </TextListItem>
                <TextListItem component={TextListItemVariants.dd}>
                  Devices offline
                </TextListItem>
                <TextListItem component={TextListItemVariants.dt}>
                  {isDevicesInfoLoading === false ? (
                    <Text component={TextVariants.h1}>
                      <Link to={`/groups/${uuid}`}>
                        {devicesInfo?.deliveringDevices}
                      </Link>
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

GroupsInfo.propTypes = {
  uuid: PropTypes.string,
};

export default GroupsInfo;
