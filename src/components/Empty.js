import React from 'react';
import {
  Title,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import PropTypes from 'prop-types';
import { createLink } from '../utils';
import { iconMapper } from '../constants';

const Empty = ({
  bgColor,
  icon,
  title,
  body,
  primaryAction,
  secondaryActions,
}) => (
  <EmptyState variant="large" style={{ backgroundColor: bgColor || '' }}>
    {icon && <EmptyStateIcon icon={iconMapper[icon]} />}
    <Title headingLevel="h4" size="lg">
      {title}
    </Title>
    <EmptyStateBody>{body}</EmptyStateBody>
    {primaryAction && (
      <>
        {primaryAction.href ? (
          createLink({
            pathname: `${primaryAction.href}`,
            linkText: primaryAction.text,
            history,
          })
        ) : (
          <Button variant="primary" onClick={primaryAction.click}>
            {primaryAction.text}
          </Button>
        )}
      </>
    )}
    <EmptyStateSecondaryActions>
      {secondaryActions.map(({ type, title, link, onClick }, index) => (
        <Button
          component={type === 'link' ? 'a' : 'button'}
          href={link}
          variant="link"
          target={type === 'link' ? '_blank' : ''}
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

Empty.defaultProps = {
  secondaryActions: [],
};

export default Empty;
