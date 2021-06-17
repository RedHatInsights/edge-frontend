import React, { Fragment, useContext, useEffect } from 'react';
import {
  TextContent,
  Text,
  TextVariants,
  TextList,
  TextListItem,
  TextListVariants,
  TextListItemVariants,
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { shallowEqual, useSelector } from 'react-redux';
import { RegistryContext } from '../../store';
import { createImageReducer } from '../../store/reducers';
import { Bullseye, Spinner, Alert } from '@patternfly/react-core';

const ReviewStep = () => {
  const { getState } = useFormApi();
  const { getRegistry } = useContext(RegistryContext);
  const { isLoading, hasError } = useSelector(
    ({ createImageReducer }) => ({
      isLoading:
        createImageReducer?.isLoading !== undefined
          ? createImageReducer?.isLoading
          : false,
      hasError: createImageReducer?.hasError || false,
      error: createImageReducer?.error || null,
    }),
    shallowEqual
  );
  useEffect(() => {
    const registered = getRegistry().register({ createImageReducer });
    return () => registered();
  }, []);

  if (isLoading) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <Fragment>
      {hasError && (
        <Alert
          variant="danger"
          title="Failed sending the request: Edge API is not available"
        />
      )}
      <TextContent>
        <Text>
          Review the information and click the Create button to create your
          image using the following criteria.
        </Text>
        <Text component={TextVariants.h1}>Image output</Text>
        <TextList
          component={TextListVariants.dl}
          data-testid="review-image-output"
        >
          <TextListItem component={TextListItemVariants.dt}>
            Release
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            Red Hat Enterprise Linux (RHEL) 8.3
          </TextListItem>
        </TextList>
        <Text component={TextVariants.h1}>Registration</Text>
        <TextList
          component={TextListVariants.dl}
          data-testid="review-image-registration"
        >
          <TextListItem component={TextListItemVariants.dt}>
            Username
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {getState().values['username']}
          </TextListItem>
          {getState().values.credentials.includes('password') ? (
            <>
              <TextListItem component={TextListItemVariants.dt}>
                Password
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd} type="password">
                {'*'.repeat(getState().values.password.length)}
              </TextListItem>
            </>
          ) : null}
          {getState().values.credentials.includes('sshKey') ? (
            <>
              <TextListItem component={TextListItemVariants.dt}>
                SSH Key
              </TextListItem>
              <TextListItem component={TextListItemVariants.dd} type="password">
                {getState().values.sshKey}
              </TextListItem>
            </>
          ) : null}
        </TextList>
        <Text component={TextVariants.h1}>Packages</Text>
        <TextList
          component={TextListVariants.dl}
          data-testid="review-image-packages"
        >
          <TextListItem component={TextListItemVariants.dt}>
            Added Packages
          </TextListItem>
          <TextListItem component={TextListItemVariants.dd}>
            {getState().values['selected-packages'] === undefined
              ? 0
              : getState().values['selected-packages'].length}
          </TextListItem>
        </TextList>
      </TextContent>
    </Fragment>
  );
};

export default ReviewStep;
