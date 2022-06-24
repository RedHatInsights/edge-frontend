import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

const RepositoryHeader = () => {
  return (
    <PageHeader>
      <>
        <PageHeaderTitle title="Custom repositories" />
        <p className="pf-u-mt-sm">
          Add custom repositories to build RHEL for Edge images with additional
          packages.
        </p>
      </>
    </PageHeader>
  );
};

export default RepositoryHeader;
