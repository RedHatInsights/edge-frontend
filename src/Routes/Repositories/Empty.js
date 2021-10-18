import React from 'react';
import {
  Title,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
} from '@patternfly/react-core';
import RepositoryIcon from '@patternfly/react-icons/dist/esm/icons/repository-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const emptyStateIconMapper = {
  repository: RepositoryIcon,
};

const Empty = ({ icon, title, body, primaryAction, secondaryActions }) => (
  <EmptyState>
    <EmptyStateIcon icon={emptyStateIconMapper[icon]} />
    <Title headingLevel="h4" size="lg">
      {title}
    </Title>
    <EmptyStateBody>{body}</EmptyStateBody>
    <Button onClick={primaryAction.click} variant="primary">
      {primaryAction.text}
    </Button>
    <EmptyStateSecondaryActions>
      {secondaryActions.map(({ title, link }) => (
        <Button variant="link">
          <a href={link}>{title}</a>
          <ExternalLinkAltIcon className="pf-u-ml-sm" />
        </Button>
      ))}
    </EmptyStateSecondaryActions>
  </EmptyState>
);

export default Empty;
