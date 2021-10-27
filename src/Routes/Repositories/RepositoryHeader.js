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
            aria-label="Basic popover"
            className="pf-ml-0"
            headerContent={<div data-testid="repository-header-popover-title" >About Fleet Management</div>}
            bodyContent={
              <div data-testid="repository-header-popover-body" >
                Fleet Management is a service that allows you to provision, update and maintain edge systems.
              </div>
            }
            footerContent={
              <Button data-testid="repository-header-popover-footer" variant="link" style={{ 'padding-left': 0 }}>
                <a href="#">Documentation</a>
                <ExternalLinkAltIcon className="pf-u-ml-sm" />
              </Button>
            }
          >
            <Button
              variant="plain"
              className="extra-small-padding-right"
              isSmall="true"
              data-testid="repository-header-popover-btn"
            >
              <QuestionCircleIcon />
            </Button>
          </Popover>
        </p>
      </>
    </PageHeader>
  );
};

export default RepositoryHeader;
