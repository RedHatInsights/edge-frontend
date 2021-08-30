import React, { Fragment } from 'react';
import {
  FormGroup,
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
    <FormGroup>
      <FormGroup
        label="SSH key"
        helperTextInvalid={meta.error}
        validated={meta.error && meta.touched ? 'error' : 'default'}
        isRequired
      >
        <TextArea
          className="pf-u-h-25vh"
          id="credentials"
          placeholder="Paste your public SSH key"
          {...sshKeyInput}
        />
      </FormGroup>
      <Fragment>
        <Text component={TextVariants.small}>
          <Text
            target="_blank"
            href="https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/using-secure-communications-between-two-systems-with-openssh_configuring-basic-system-settings#generating-ssh-key-pairs_using-secure-communications-between-two-systems-with-openssh"
            isVisitedLink
            component={TextVariants.a}
          >
            Learn more about SSH keys
            <ExternalLinkAltIcon className="pf-u-ml-sm" />
          </Text>
        </Text>
      </Fragment>
    </FormGroup>
  );
};

export default SSHInputField;
