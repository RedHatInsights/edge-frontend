/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Page,
  PageSection,
  Flex,
  FlexItem,
  Text,
  TextContent,
  Title,
  Card,
  CardBody,
  Bullseye,
  Spinner,
  Backdrop,
} from '@patternfly/react-core';
import UpdateVersionTable from './UpdateVersionTable';
import { getDeviceHasUpdate } from '../../api/devices';
import { distributionMapper } from '../../constants';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

const CurrentVersion = ({ data }) => {
  let d = [
    { label: 'Version', value: data[0]?.version, width: '145px' },
    { label: 'Release', value: data[0]?.release, width: '154px' },
    {
      label: 'Additional packages',
      value: data[0]?.additionalPackages,
      width: '144px',
    },
    { label: 'All packages', value: 'TBD', width: '140px' },
    { label: 'Systems running', value: 'TBD', width: '145px' },
    { label: 'Created', value: data[0]?.created, width: '140px' },
  ];

  return (
    <>
      <TextContent>
        <Title headingLevel='h2'>
          <Text>Current version</Text>
        </Title>
      </TextContent>
      <Flex className='pf-u-mt-sm' spaceItems={{ default: 'spaceItems4xl' }}>
        <FlexItem
          spacer={{ default: 'spacerXs' }}
          style={{ width: '48px' }}
        ></FlexItem>
        {d.map(({ label, value, width }, index) => {
          return (
            <FlexItem key={index} style={{ width: width }}>
              <Text className='pf-u-font-size-sm' component={'b'}>
                {label}
              </Text>
              <Text className='pf-u-mt-sm pf-u-font-size-sm'>{value}</Text>
            </FlexItem>
          );
        })}
      </Flex>
    </>
  );
};

const AllVersions = ({ data, setUpdatePage, refreshTable }) => {
  return (
    <>
      <TextContent>
        <Title headingLevel='h2'>
          <Text className='pf-u-mt-md'>Select version to update to</Text>
        </Title>
      </TextContent>
      <UpdateVersionTable
        setUpdatePage={setUpdatePage}
        data={data}
        refreshTable={refreshTable}
      />
    </>
  );
};
AllVersions.propTypes = {
  setUpdatePage: PropTypes.func,
};

const PageLayout = (props) => {
  return (
    <Page>
      <PageSection isWidthLimited>
        <Card>
          <CardBody>{props.children}</CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};

const UpdateSystems = ({ setUpdatePage, updatePage, refreshTable }) => {
  const [imageData, setImageData] = useState();
  //useApi
  useEffect(() => {
    (async () => {
      const image_data = await getDeviceHasUpdate(updatePage.deviceData[0].id);
      setImageData(image_data);
    })();
  }, []);

  const buildRows = (data, all) => {
    var d = [];
    var uuid = data?.Device?.UUID;
    var device_name = data?.Device?.DeviceName;

    {
      data = all ? data?.ImageInfo?.UpdatesAvailable : [data?.ImageInfo?.Image];
      data?.map((element) => {
        element = all ? element?.Image : element;
        d.push({
          version: element?.Version,
          release: distributionMapper[element?.Distribution],
          additionalPackages: element?.Packages?.length,
          allPackages: 'TBD',
          systemsRunning: 'TBD',
          created: (
            <span>
              <DateFormat type='relative' date={element?.CreatedAt} />
            </span>
          ),
          commitID: element?.CommitID,
          deviceUUID: uuid,
          deviceName: device_name,
        });
      });
    }
    return d;
  };

  return (
    <>
      {imageData ? (
        <PageLayout>
          <CurrentVersion data={buildRows(imageData, false)} />
          <AllVersions
            data={buildRows(imageData, true)}
            setUpdatePage={setUpdatePage}
            refreshTable={refreshTable}
          />
        </PageLayout>
      ) : (
        <Backdrop>
          <Bullseye>
            <Spinner isSVG diameter='100px' />
          </Bullseye>
        </Backdrop>
      )}
    </>
  );
};

UpdateSystems.propTypes = { setUpdatePage: PropTypes.func };

export default UpdateSystems;
