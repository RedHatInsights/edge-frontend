import React, { Fragment, useContext, useEffect } from 'react';
import {
  TextContent,
  Text,
} from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { imageTypeMapper, releaseMapper } from  '../../Routes/ImageManagerDetail/constants';
import { shallowEqual, useSelector } from 'react-redux';
import { RegistryContext } from '../../store';
import { createImageReducer } from '../../store/reducers';
import { Bullseye, Spinner, Alert } from '@patternfly/react-core';
import ReviewSection from '../ReviewSection';

const ReviewStep = () => {
  const { getState } = useFormApi();
  console.log(getState().values);
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

  const details = [
    { name: 'Name', value: getState().values['image-name'] }, 
    { name: 'Description', value: getState().values.description }
  ];

  const output = [
    { name: 'Release', value: releaseMapper[getState().values.release] }, 
    { name: 'Type', 
      value: getState().values.imageType.map(type =>
        `${imageTypeMapper[type]}`)
        .join(', ')
    }
  ];

  const registration = [
    { name: 'Username', value: getState().values['username'] }, 
    { name: 'ssh-key', value: getState().values.credentials }
  ];

  const packages = [
    { name: 'Added Packages', 
      value: getState().values['selected-packages'] === undefined
              ? 0
              : getState().values['selected-packages'].length
    }
  ];

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
        <ReviewSection 
          title={'Details'}
          data={details}
          testid={'review-image-details'}
        /> 
        <ReviewSection 
          title={'Output'}
          data={output}
          testid={'review-image-output'}
        />
        <ReviewSection 
          title={'Registration'}
          data={registration}
          testid={'review-image-registration'}
        />
        <ReviewSection 
          title={'Packages'}
          data={packages}
          testid={'review-image-packages'}
        />
        </TextContent>
    </Fragment>
  );
};

export default ReviewStep;
