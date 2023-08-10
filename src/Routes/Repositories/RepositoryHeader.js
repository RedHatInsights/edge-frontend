import React, { useEffect } from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const RepositoryHeader = () => {
  const chrome = useChrome();

  useEffect(() => {
    chrome?.updateDocumentTitle?.(
      'Custom Repositories - Manage Images | Edge management'
    );
  }, [chrome]);

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
