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
import PropTypes from 'prop-types';

const emptyStateIconMapper = {
  repository: RepositoryIcon,
};

const Empty = ({ icon, title, body, primaryAction, secondaryActions }) => (
  <EmptyState>
    <EmptyStateIcon
      data-testid="empty-state-icon"
      icon={emptyStateIconMapper[icon]}
    />
    <Title data-testid="empty-state-title" headingLevel="h4" size="lg">
      {title}
    </Title>
    <EmptyStateBody data-testid="empty-state-body">{body}</EmptyStateBody>
    <Button
      data-testid="empty-state-primary-action"
      onClick={primaryAction.click}
      variant="primary"
    >
      {primaryAction.text}
    </Button>
    <EmptyStateSecondaryActions data-testid="empty-state-secondary-actions">
      {secondaryActions.map(({ title, link }, index) => (
        <Button variant="link" key={index}>
          <a href={link}>{title}</a>
          <ExternalLinkAltIcon className="pf-u-ml-sm" />
        </Button>
      ))}
    </EmptyStateSecondaryActions>
  </EmptyState>
);

Empty.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  body: PropTypes.string,
  primaryAction: PropTypes.object.isRequired,
  secondaryActions: PropTypes.array,
};

export default Empty;
