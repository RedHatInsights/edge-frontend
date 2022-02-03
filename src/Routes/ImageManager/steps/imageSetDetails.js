import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Flex, FlexItem, Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { nameValidator } from '../../../constants';

const helperText =
  'Can only contain letters, numbers, spaces, hyphens( - ), and underscores( _ ).';

const CharacterCount = () => {
  const { getState } = useFormApi();
  const description = getState().values?.description;
  return <h1>{description?.length || 0}/250</h1>;
};

export default {
  title: 'Details',
  name: 'imageSetDetails',
  nextStep: 'imageOutput',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'description',
      label: (
        <Text>
          Enter a name and description to easily identify your image later.
        </Text>
      ),
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'name',
      label: 'Image name',
      placeholder: 'Image name',
      helperText: helperText,
      validate: [
        { type: 'asyncImageNameValidation' },
        { type: validatorTypes.REQUIRED },
        nameValidator,
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
      ],
      isRequired: true,
    },
    {
      component: componentTypes.TEXTAREA,
      style: {
        paddingRight: '32px',
        height: '25vh',
      },
      name: 'description',
      label: (
        <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
          <FlexItem>
            <Text component={'b'}>Description</Text>
          </FlexItem>
          <FlexItem>
            <CharacterCount />
          </FlexItem>
        </Flex>
      ),
      placeholder: 'Add description',

      resizeOrientation: 'vertical',
      validate: [{ type: validatorTypes.MAX_LENGTH, threshold: 250 }],
    },
  ],
};
