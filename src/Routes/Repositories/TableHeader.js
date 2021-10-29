import React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const Header = () => {
  return (
    <TextContent
      data-testid="repositories-table-header"
      style={{ padding: '15px', backgroundColor: 'white' }}
    >
      <Text
        data-testid="repositories-table-header-title"
        component={TextVariants.h1}
      >
        Custom repositories
      </Text>
      <Text
        data-testid="repositories-table-header-description"
        component={TextVariants.p}
      >
        Add custom repositories to build RHEL for Edge images with additional
        packages.{' '}
        <Text style={{ display: 'inline' }} component={TextVariants.small}>
          <Text
            data-testid="repositories-table-header-link"
            component={TextVariants.a}
            href="#"
          >
            Learn more
            <ExternalLinkAltIcon size="sm" className="pf-u-ml-sm" />
          </Text>
        </Text>
      </Text>
    </TextContent>
  );
};

export default Header;
