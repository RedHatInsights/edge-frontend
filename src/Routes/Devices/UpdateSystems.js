import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Page,
  PageSection,
  Text,
  TextContent,
  Title,
  Card,
  CardBody,
  Bullseye,
  Spinner,
  Backdrop,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import UpdateVersionTable from './UpdateVersionTable';
import { getDeviceHasUpdate } from '../../api/devices';
import { distributionMapper } from '../../constants';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

const CurrentVersion = ({ data }) => {
  let d = [
    { label: 'Version', value: data[0]?.version, width: '180px' },
    { label: 'Release', value: data[0]?.release, width: '190px' },
    {
      label: 'Additional packages',
      value: data[0]?.additionalPackages,
      width: '180px',
    },
    { label: 'All packages', value: data[0]?.allPackages, width: '180px' },
    {
      label: 'Systems running',
      value: data[0]?.systemsRunning,
      width: '180px',
    },
    { label: 'Created', value: data[0]?.created, width: 'max-content' },
  ];

  return (
    <>
      <TextContent>
        <Title headingLevel="h2">
          <Text>Current version</Text>
        </Title>
      </TextContent>
      <Grid className="pf-u-mt-sm" span={12} style={{ paddingLeft: '43px' }}>
        {d.map(({ label, value, width }, index) => {
          return (
            <GridItem
              key={index}
              span={2}
              style={{ width: width, padding: '8px', position: 'relative' }}
            >
              <Text className="pf-u-font-size-sm" component={'b'}>
                {label}
              </Text>
              <Text className="pf-u-mt-sm pf-u-font-size-sm">{value}</Text>
            </GridItem>
          );
        })}
      </Grid>
    </>
  );
};
CurrentVersion.propTypes = {
  data: PropTypes.array,
};

const AllVersions = ({ data, setUpdatePage, refreshTable }) => {
  return (
    <>
      <TextContent>
        <Title headingLevel="h2">
          <Text className="pf-u-mt-md">Select version to update to</Text>
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
  data: PropTypes.array,
  setUpdatePage: PropTypes.func,
  refreshTable: PropTypes.func,
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
PageLayout.propTypes = {
  children: PropTypes.any,
  data: PropTypes.array,
  setUpdatePage: PropTypes.func,
  refreshTable: PropTypes.func,
};

const UpdateSystems = ({ setUpdatePage, updatePage, refreshTable }) => {
  const [imageData, setImageData] = useState();
  useEffect(() => {
    (async () => {
      const image_data = await getDeviceHasUpdate(updatePage.deviceData[0].id);
      setImageData(image_data);
    })();
  }, []);

  const buildRows = (data, all) => {
    var d = [];

    {
      var _data = all
        ? data?.ImageInfo?.UpdatesAvailable
        : [data?.ImageInfo?.Image];
      _data?.map((element, index) => {
        element = all ? element?.Image : element;
        d.push({
          version: element?.Version,
          release: distributionMapper[element?.Distribution],
          additionalPackages: element?.Packages?.length
            ? element?.Packages?.length
            : '0',
          allPackages: all
            ? _data[index]?.TotalPackages
            : data?.ImageInfo?.TotalPackages,
          systemsRunning: all
            ? _data[index]?.SystemsRunning
            : data?.ImageInfo?.SystemsRunning,
          created: (
            <span>
              <DateFormat type="relative" date={element?.CreatedAt} />
            </span>
          ),
          commitID: element?.CommitID,
          deviceUUID: data?.Device?.UUID,
          deviceName: data?.Device?.DeviceName,
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
            <Spinner isSVG diameter="100px" />
          </Bullseye>
        </Backdrop>
      )}
    </>
  );
};

UpdateSystems.propTypes = {
  setUpdatePage: PropTypes.func,
  refreshTable: PropTypes.func,
  updatePage: PropTypes.object,
};

export default UpdateSystems;
