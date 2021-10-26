import React from 'react';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Popover, Button } from '@patternfly/react-core';
import QuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const RepositoryHeader = () => {
  return (
    <PageHeader data-testid="repository-header-title" >
      <>
        <PageHeaderTitle title="Applications settings" />
        <p data-testid="repository-header-sub-title" className="pf-u-mt-sm">
          Settings for Fleet Management
          <Popover
            data-testid="repository-header-popover"
            aria-label="Basic popover"
            headerContent={<div>About Fleet Management</div>}
            bodyContent={
              <div>
                Fleet Management is a service that allows you to provision,
                update and maintain edge systems.
              </div>
            }
            footerContent={
              <Button variant="link" style={{ 'padding-left': 0 }}>
                <a href="#">Documentation</a>
                <ExternalLinkAltIcon className="pf-u-ml-sm" />
              </Button>
            }
          >
            <QuestionCircleIcon
              data-testid="repository-header-question-icon"
              style={{ cursor: 'pointer' }}
              className="pf-u-ml-xs"
            />
          </Popover>
        </p>
      </>
    </PageHeader>
  );
};

export default RepositoryHeader;
