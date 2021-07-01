import React, { Fragment } from 'react';
import {
  FormGroup,
  TextInput,
  TextArea,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const SSHInputField = (props) => {
  const { input: sshKeyInput, meta } = useFieldApi({
    name: 'credentials',
    ...props,
  });
  return (
    <FormGroup
      label="SSH key"
      helperTextInvalid={meta.error}
      validated={meta.error && meta.touched ? 'error' : 'default'}
      isRequired
      helperText={
        <Fragment>
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
        </Fragment>
      }
    >
      <TextArea
        id="credentials"
        placeholder="Paste your public SSH key"
        {...sshKeyInput}
      />
    </FormGroup>
  );
};

export default SSHInputField;
