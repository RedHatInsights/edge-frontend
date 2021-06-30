import React from 'react';
import {
  FormGroup,
  TextInput,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const SSHInputField = () => {
  const { input: sshKeyInput } = useFieldApi({ name: 'credentials' });
  return (
    <FormGroup
      label="Output Type"
      isHelperTextBeforeField
      hasNoPaddingTop
      isRequired
      isStack
    >
      <TextInput
        id="credentials"
        placeholder="Enter SSH key"
        {...sshKeyInput}
      />
      <TextContent>
        <Text component={TextVariants.small}>
          Paste your public SSH key file here.
        </Text>
      </TextContent>
      <Text component={TextVariants.small}>
        <Text
          target="_blank"
          href="https://en.wikipedia.org/wiki/Secure_Shell_Protocol"
          isVisitedLink
          component={TextVariants.a}
        >
          Learn more about SSH keys
          <ExternalLinkAltIcon className="pf-u-ml-sm" />
        </Text>
      </Text>
    </FormGroup>
  );
};

export default SSHInputField;
