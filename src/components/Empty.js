import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Stack,
  StackItem,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
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
  target,
}) => (
  <EmptyState variant="lg" style={{ backgroundColor: bgColor || '' }}>
    {icon && <EmptyStateIcon icon={iconMapper[icon]} />}
    <EmptyStateHeader titleText={<>{title}</>} headingLevel="h4" />
    <EmptyStateBody>
      {Array.isArray(body)
        ? body.map((item, index) => (
            <div key={index}>
              {item}
              <br />
              <br />
            </div>
          ))
        : body}
    </EmptyStateBody>
    <EmptyStateFooter>
      {primaryAction && (
        <>
          {primaryAction.href ? (
            createLink({
              pathname: `${primaryAction.href}`,
              linkText: primaryAction.text,
              target: target,
            })
          ) : (
            <Button variant="primary" onClick={primaryAction.click}>
              {primaryAction.text}
            </Button>
          )}
        </>
      )}
      <EmptyStateActions>
        <Stack>
          {secondaryActions.map(
            ({ type, title, link, onClick, variant, className }, index) => (
              <StackItem key={index}>
                <Button
                  component={type === 'link' ? 'a' : 'button'}
                  className={className}
                  href={link}
                  variant={variant || 'link'}
                  target={type === 'link' ? '_blank' : ''}
                  key={index}
                  onClick={onClick}
                >
                  {title}
                  {link && <ExternalLinkAltIcon className="pf-u-ml-sm" />}
                </Button>
              </StackItem>
            )
          )}
        </Stack>
      </EmptyStateActions>
    </EmptyStateFooter>
  </EmptyState>
);

Empty.propTypes = {
  bgColor: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  primaryAction: PropTypes.object,
  secondaryActions: PropTypes.array,
  target: PropTypes.string,
};

Empty.defaultProps = {
  secondaryActions: [],
};

export default Empty;
