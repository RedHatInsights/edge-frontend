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
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';

const emptyStateIconMapper = {
  repository: RepositoryIcon,
  search: SearchIcon,
};

const Empty = ({
  bgColor,
  icon,
  title,
  body,
  primaryAction,
  secondaryActions,
}) => (
  <EmptyState style={{ backgroundColor: bgColor || '' }}>
    <EmptyStateIcon icon={emptyStateIconMapper[icon]} />
    <Title headingLevel="h4" size="lg">
      {title}
    </Title>
    <EmptyStateBody>{body}</EmptyStateBody>
    {primaryAction && (
      <Button onClick={primaryAction.click} variant="primary">
        {primaryAction.text}
      </Button>
    )}
    <EmptyStateSecondaryActions>
      {secondaryActions.map(({ type, title, link, onClick }, index) => (
        <Button
          component={type === 'link' ? 'a' : 'button'}
          href={link}
          variant="link"
          key={index}
          onClick={onClick}
        >
          {title}
          {link && <ExternalLinkAltIcon className="pf-u-ml-sm" />}
        </Button>
      ))}
    </EmptyStateSecondaryActions>
  </EmptyState>
);

Empty.propTypes = {
  bgColor: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  primaryAction: PropTypes.object,
  secondaryActions: PropTypes.array,
};

export default Empty;
