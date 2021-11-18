import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Flex, FlexItem, Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { checkImageName } from '../../../api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
const helperText =
  'Can only contain letters, numbers, spaces, hyphens(-), and underscores(_).';

  const asyncImageNameValidation = async (value) => {
    const checkName = await checkImageName(value)
    if (checkName.ImageExists) {
      throw ('Name already exists');
    } else {
      return true
    }
  }

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
        asyncImageNameValidation,
        { type: validatorTypes.REQUIRED },
        {
          type: validatorTypes.PATTERN,
          pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-\s]*$/,
          message: helperText,
        },
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
      ],
      isRequired: true,
    },
    {
      component: componentTypes.TEXTAREA,
      style: {
        paddingRight: '32px',
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
