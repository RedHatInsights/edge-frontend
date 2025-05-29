import React from 'react';
import {
  Alert,
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

const RHEM_DOCUMENTATION_URL =
  'https://docs.redhat.com/en/documentation/red_hat_ansible_automation_platform/2.5/html/managing_device_fleets_with_the_red_hat_edge_manager/index';

const RepositoryLinkAccess = () => (
  <>
    <PageHeader>
      <TextContent>
        <Text component="h1" id="custom-repos-title">
          Custom repositories
        </Text>
      </TextContent>
    </PageHeader>
    <Alert
      variant="info"
      isInline
      title={<>Upcoming decommission of hosted Edge Management service</>}
      className="pf-v5-u-mt-sm pf-v5-u-mb-sm"
    >
      <TextContent>
        <Text>
          As of July 31, 2025, the hosted edge management service will no longer
          be supported. This means that pushing image updates to Immutable
          (OSTree) systems using the Hybrid Cloud Console will be discontinued.
          For an alternative way to manage edge systems, customers are
          encouraged to explore Red Hat Edge Manager (RHEM).
        </Text>
        <Text>
          <Button
            component="a"
            target="_blank"
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            isInline
            href={RHEM_DOCUMENTATION_URL}
          >
            Red Hat Edge Manager (RHEM) documentation
          </Button>
        </Text>
      </TextContent>
    </Alert>

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
