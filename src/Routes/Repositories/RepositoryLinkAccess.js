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
        Your repositories have moved!
      </Title>
      <EmptyStateBody id="moved-state-body">
        Custom repositories have been combined so that you can use them across
        all of the console.
      </EmptyStateBody>
      <Button
        id="moved-state-button"
        variant="primary"
        component="a"
        target="_blank"
        href={`https://${window.location.host}/settings/content`}
      >
        Go to custom repositories
      </Button>
    </EmptyState>
  </>
);

export default RepositoryLinkAccess;
