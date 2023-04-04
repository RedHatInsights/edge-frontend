import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  TextContent,
  Text,
  Title,
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
      <EmptyStateIcon id="external-link-icon" icon={ExternalLinkAltIcon} />
      <Title id="moved-state-title" headingLevel="h4" size="xl">
        Custom repositories have moved
      </Title>
      <EmptyStateBody id="moved-state-body">
        You can now use your custom repositories across the console. Access them
        on the Repositories page.
      </EmptyStateBody>
      <Button
        id="moved-state-button"
        variant="primary"
        component="a"
        target="_blank"
        href={`https://${window.location.host}/settings/content`}
      >
        Go to Repositories
      </Button>
    </EmptyState>
  </>
);

export default RepositoryLinkAccess;
