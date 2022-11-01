import React from 'react';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import { Flex, FlexItem, Text } from '@patternfly/react-core';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import { checkImageName } from '../../../api/images';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { nameValidator } from '../../../utils';

const helperText =
  'Can only contain letters, numbers, spaces, hyphens ( - ), and underscores( _ ).';

const CharacterCount = () => {
  const { getState } = useFormApi();
  const description = getState().values?.description;
  return <h1>{description?.length || 0}/250</h1>;
};

const getImageSetDetailsSchema = () => ({
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
        // Define async validator inline here, so that results are not cached
        async (value = '') => {
          // Do not fire validation request for empty name
          if (value.length === 0) {
            return undefined;
          }
          const resp = await checkImageName(value);
          if (resp.ImageExists) {
            // Async validator has to throw error, not return it
            throw 'Name already exists';
          }
        },
        { type: validatorTypes.REQUIRED },
        { type: validatorTypes.MAX_LENGTH, threshold: 50 },
        nameValidator,
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
});

export default getImageSetDetailsSchema;
