import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import '@patternfly/quickstarts/dist/quickstarts.min.css';
import Quickstarts from './Quickstarts';

const LearningResources = () => {
  return (
    <>
      <PageHeader>
        <PageHeaderTitle title="Learning Resources" />
      </PageHeader>
      <Quickstarts />
    </>
  );
};

export default LearningResources;
