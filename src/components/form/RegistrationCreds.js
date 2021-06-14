import React, { useCallback } from 'react';
import {
  FormGroup,
  Checkbox,
  TextInput,
  TextArea,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

export const registrationCredsValidator = () => (value, state) => {
  if (value.length === 0) {
    return { checkbox: 'select at least one validation method' };
  }
  let errs = {};
  if (
    value.includes('password') &&
    (state['password'] === undefined || state['password'] === '')
  ) {
    errs = { ...errs, password: 'Required' };
  }
  if (
    value.includes('sshKey') &&
    (state['sshKey'] === undefined || state['sshKey'] === '')
  ) {
    errs = { ...errs, sshKey: 'Required' };
  }
  return errs;
};

const RegistrationCreds = (props) => {
  const { input, meta } = useFieldApi(props);
  const toggleCheckbox = useCallback(
    (checked, event) => {
      input.onChange(
        checked
          ? [...input.value, event.currentTarget.id]
          : input.value.filter((item) => item !== event.currentTarget.id)
      );
    },
    [input.onChange]
  );

  const { input: passwordInput } = useFieldApi({ name: 'password' });
  const { input: sshKeyInput } = useFieldApi({ name: 'sshKey' });

  return (
    <FormGroup
      label="Select at least one to validate credentials"
      isHelperTextBeforeField
      hasNoPaddingTop
      isRequired
      isStack
    >
      <Checkbox
        label="Password"
        id="password"
        isChecked={input.value.includes('password')}
        onChange={toggleCheckbox}
      />
      {input.value.includes('password') ? (
        <FormGroup
          helperTextInvalid={
            meta.dirty && meta.error['password'] !== undefined
              ? meta.error['password']
              : undefined
          }
        >
          <TextInput type="password" {...passwordInput} />
        </FormGroup>
      ) : null}
      <Checkbox
        label="SSH"
        id="sshKey"
        isChecked={input.value.includes('sshKey')}
        onChange={toggleCheckbox}
      />
      {input.value.includes('sshKey') ? (
        <FormGroup
          helperTextInvalid={
            meta.dirty && meta.error['sshKey'] !== undefined
              ? meta.error['sshKey']
              : undefined
          }
        >
          <TextArea {...sshKeyInput} />
        </FormGroup>
      ) : null}
    </FormGroup>
  );
};

export default RegistrationCreds;
