import React from 'react';
import { TextContent, Text, TextVariants } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const Header = () => {
  return (
    <TextContent style={{ padding: '15px', backgroundColor: 'white' }}>
      <Text component={TextVariants.h1}>Third-party repositories</Text>
      <Text component={TextVariants.p}>
        Add third-party repositories to build RHEL for Edge images with
        additional packages.{' '}
        <Text component={TextVariants.a} href="#">
          Learn more
          <ExternalLinkAltIcon className="pf-u-ml-sm" />
        </Text>
      </Text>
    </TextContent>
  );
};

export default Header;
