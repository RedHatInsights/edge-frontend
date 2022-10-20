/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  Page,
  PageSection,
  Grid,
  GridItem,
  Text,
  TextContent,
  Title,
  Card,
  CardBody,
} from '@patternfly/react-core';
import GeneralTable from '../../components/general-table/GeneralTable';

const currentVersionData = [
  { label: 'Version', value: 1 },
  { label: 'Release', value: 1 },
  { label: 'Additional packages', value: 1 },
  { label: 'All packages', value: 1 },
  { label: 'Systems running', value: 1 },
  { label: 'Created', value: 1 },
];

const CurrentVersion = ({ data }) => (
  <>
    <TextContent>
      <Title headingLevel='h2'>
        <Text>Current version</Text>
      </Title>
    </TextContent>
    <Grid className='pf-u-mt-sm' span={12}>
      {data.map(({ label, value }, index) => {
        return (
          <GridItem key={index} span={2}>
            <Text component={'b'}>{label}</Text>
            <Text className='pf-u-mt-sm'>{value}</Text>
          </GridItem>
        );
      })}
    </Grid>
  </>
);

const AllVersions = ({ data }) => (
  <>
    <TextContent>
      <Title headingLevel='h2'>
        <Text>Select version to update to</Text>
      </Title>
    </TextContent>
    <Grid className='pf-u-mt-sm' span={12}>
      {data.map(({ label, value }, index) => {
        return (
          <GridItem key={index} span={2}>
            <Text component={'b'}>{label}</Text>
            <Text className='pf-u-mt-sm'>{value}</Text>
          </GridItem>
        );
      })}
    </Grid>
    <GeneralTable
      className='pf-u-mt-sm'
      apiFilterSort={false}
      isUseApi={false}
      loadTableData={fetchRepos}
      filters={filters}
      tableData={{
        count: data?.count,
        data,
        isLoading,
        hasError,
      }}
      columnNames={[{ title: 'Name', type: 'name', sort: false }]}
      rows={isLoading ? [] : buildRows(data)}
      defaultSort={{ index: 0, direction: 'desc' }}
      hasCheckbox={false}
      selectedItems={getRepoIds}
      initSelectedItems={wizardState}
    />
  </>
);

const PageLayout = (props) => {
  return (
    <Page>
      <PageSection isWidthLimited isCenterAligned>
        <Card>
          <CardBody>{props.children}</CardBody>
        </Card>
      </PageSection>
    </Page>
  );
};

const UpdateSystems = () => {
  return (
    <>
      <PageLayout>
        <CurrentVersion data={currentVersionData} />
        <AllVersions data={currentVersionData} />
      </PageLayout>
    </>
  );
};

export default UpdateSystems;
