import React, { Fragment, useContext, useEffect } from 'react';
import { TextContent, Text } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  imageTypeMapper,
  releaseMapper,
} from '../../Routes/ImageManagerDetail/constants';
import { shallowEqual, useSelector } from 'react-redux';
import { RegistryContext } from '../../store';
import { createImageReducer } from '../../store/reducers';
import { Bullseye, Spinner, Alert } from '@patternfly/react-core';
import ReviewSection from '../ReviewSection';

const ReviewStep = () => {
  const { getState } = useFormApi();
  const isUpdate = getState().initialValues.isUpdate;
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
    { name: 'Name', value: getState().values.name },
    { name: 'Version', value: getState().initialValues.version + 1 },
    { name: 'Description', value: getState().values.description },
  ];

  const output = [
    { name: 'Release', value: releaseMapper[getState().values.release] },
    {
      name: 'Type',
      value: getState()
        .values.imageType.map((type) => `${imageTypeMapper[type]}`)
        .join(', '),
    },
  ];

  const registration = [
    { name: 'Username', value: getState().values['username'] },
    { name: 'ssh-key', value: getState().values.credentials },
  ];

  const before = getState().initialValues['selected-packages'];
  const after = getState().values['selected-packages'];
  const calcPkgDiff = (arr1, arr2) =>
    arr1.reduce(
      (acc, { name }) => acc + (!arr2.some((pkg) => pkg.name === name) ? 1 : 0),
      0
    );

  const packages = () => {
    const pkgs = [
      {
        name: isUpdate ? 'Added' : 'Added packages',
        value: calcPkgDiff(after, before),
      },
    ];
    return isUpdate
      ? [
          ...pkgs,
          { name: 'Removed', value: calcPkgDiff(before, after) },
          { name: 'Updated', value: 0 },
        ]
      : pkgs;
  };

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
          Review the information and click{' '}
          <Text component={'b'}>Create {isUpdate ? 'update' : 'image'}</Text> to{' '}
          {isUpdate ? 'update' : 'create'} your image.
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
        {getState().values.imageType.includes('rhel-edge-installer') ? (
          <ReviewSection
            title={'Registration'}
            data={registration}
            testid={'review-image-registration'}
          />
        ) : (
          ''
        )}
        <ReviewSection
          title={'Packages'}
          data={packages()}
          testid={'review-image-packages'}
        />
      </TextContent>
    </Fragment>
  );
};

export default ReviewStep;
