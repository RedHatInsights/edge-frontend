import React, { useCallback } from 'react';
import {
  FormGroup,
  Checkbox,
  TextContent,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import PropTypes from 'prop-types';

const outputHelperText = {
  'rhel-edge-commit':
    'An OSTree commit is always created when building an image.',
  'rhel-edge-installer':
    'An installable version of the image is typically created with a brand new image.',
};

const ImageOutputCheckbox = (props) => {
  const { input } = useFieldApi(props);
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

  return (
    <FormGroup
      label="Output type"
      isHelperTextBeforeField
      hasNoPaddingTop
      isRequired
      isStack
    >
      {props.options.map(({ value, label }, index) => (
        <>
          <Checkbox
            key={index}
            label={label}
            id={value}
            isChecked={input.value.includes(value)}
            onChange={toggleCheckbox}
            isDisabled={value === 'rhel-edge-commit'}
          />
          <TextContent>
            <Text component={TextVariants.small}>
              {outputHelperText[value]}
            </Text>
            {value === 'rhel-edge-installer' && (
              <Text component={TextVariants.p}>
                <Text component={TextVariants.a} isVisitedLink href="#">
                  Learn more about image types.
                </Text>
              </Text>
            )}
          </TextContent>
        </>
      ))}
    </FormGroup>
  );
};

ImageOutputCheckbox.propTypes = {
  input: PropTypes.array,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default ImageOutputCheckbox;
