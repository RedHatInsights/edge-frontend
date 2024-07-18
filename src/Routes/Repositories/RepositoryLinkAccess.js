import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Icon,
  TextContent,
  Text,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';

const RepositoryLinkAccess = () => (
  <>
    <PageHeader>
      <TextContent>
        <Text component="h1" id="custom-repos-title">
          Custom repositories
        </Text>
      </TextContent>
    </PageHeader>

    <EmptyState id="moved-state">
      <EmptyStateHeader
        titleText="Custom repositories have moved"
        icon={
          <EmptyStateIcon id="external-link-icon" icon={ExternalLinkAltIcon} />
        }
        headingLevel="h4"
      />
      <EmptyStateBody id="moved-state-body">
        You can now use your custom repositories across the console. Access them
        on the Repositories page.
      </EmptyStateBody>
      <EmptyStateFooter>
        <Button
          id="moved-state-button"
          variant="primary"
          component="a"
          target="_blank"
          href={`https://${window.location.host}/preview/insights/content`}
        >
          Go to Repositories
        </Button>
        <EmptyStateActions>
          <Button
            id="moved-state-link"
            variant="link"
            component="a"
            target="_blank"
            href="https://access.redhat.com/documentation/en-us/edge_management/2022/html-single/create_rhel_for_edge_images_and_configure_automated_management/index#proc_rhem-create-custom-repos"
          >
            Learn more about custom repositories
            <Icon
              style={{ paddingLeft: '1rem' }}
              iconSize="md"
              size="lg"
              isInline
            >
              <ExternalLinkAltIcon />
            </Icon>
          </Button>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  </>
);

export default RepositoryLinkAccess;
