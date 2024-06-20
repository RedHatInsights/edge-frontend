import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  Icon,
  TextContent,
  Text,
  Title,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import { useFeatureFlags } from '../../utils';
import { FEATURE_INVENTORY_WORKSPACES_RENAME } from '../../constants/features';

const GroupsLinkAccess = () => {
  const useWorkspacesRename = useFeatureFlags(
    FEATURE_INVENTORY_WORKSPACES_RENAME
  );

  return (
    <>
      <PageHeader>
        <TextContent>
          <Text component="h1" id="custom-repos-title">
            Groups
          </Text>
        </TextContent>
      </PageHeader>

      <EmptyState id="moved-state">
        <EmptyStateIcon id="external-link-icon" icon={ExternalLinkAltIcon} />
        <Title id="moved-state-title" headingLevel="h4" size="xl">
          Groups have moved
        </Title>
        <EmptyStateBody id="moved-state-body">
          You can now use your groups across the console. Access them on the
          Insights {useWorkspacesRename ? 'Workspaces' : 'Groups'} page.
        </EmptyStateBody>
        <Button
          id="moved-state-button"
          variant="primary"
          component="a"
          target="_blank"
          href={`https://${window.location.host}/insights/inventory/groups`}
        >
          Go to {useWorkspacesRename ? 'Workspaces' : 'Groups'}
        </Button>
        <EmptyStateSecondaryActions>
          <Button
            id="moved-state-link"
            variant="link"
            component="a"
            target="_blank"
            href="https://access.redhat.com/documentation/en-us/red_hat_insights/2023/html/viewing_and_managing_system_inventory/deploying-insights-with-rhca"
          >
            Learn more about {useWorkspacesRename ? 'Workspaces' : 'Groups'}
            <Icon
              style={{ paddingLeft: '1rem' }}
              iconSize="md"
              size="lg"
              isInline
            >
              <ExternalLinkAltIcon />
            </Icon>
          </Button>
        </EmptyStateSecondaryActions>
      </EmptyState>
    </>
  );
};

export default GroupsLinkAccess;
