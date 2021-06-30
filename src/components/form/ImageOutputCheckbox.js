import React, { useCallback } from 'react';
import { FormGroup, Checkbox } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import PropTypes from 'prop-types';

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
      label="Output Type"
      isHelperTextBeforeField
      hasNoPaddingTop
      isRequired
      isStack
    >
      {props.options.map(({ value, label }, index) => (
        <Checkbox
          key={index}
          label={label}
          id={value}
          isChecked={input.value.includes(value)}
          onChange={toggleCheckbox}
        />
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
