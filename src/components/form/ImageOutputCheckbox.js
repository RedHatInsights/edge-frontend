import React, { useCallback } from 'react';
import {
  FormGroup,
  Checkbox,
  TextContent,
  Text,
  TextVariants,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const WarningInstallerHelperText = () => (
  <HelperText className="pf-u-ml-lg" hasIcon>
    <HelperTextItem className="pf-u-pb-md" variant="warning" hasIcon>
      Creating an installable version of your image increases the build time and
      is not needed for updating existing devices. <br />
      You can create an installable version of this image later if you continue
      with this option
    </HelperTextItem>
  </HelperText>
);

const outputHelperText = {
  'rhel-edge-commit':
    'An OSTree commit is always created when building an image.',
  'rhel-edge-installer':
    'An installable version of the image is typically created with a brand new image.',
};

const ImageOutputCheckbox = (props) => {
  const { getState } = useFormApi();
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
            {getState()?.initialValues?.isUpdate &&
            value === 'rhel-edge-installer' ? (
              <WarningInstallerHelperText />
            ) : (
              <HelperText className="pf-u-ml-lg pf-u-pb-sm">
                <HelperTextItem variant="indeterminate">
                  {outputHelperText[value]}
                </HelperTextItem>
              </HelperText>
            )}
            {value === 'rhel-edge-installer' && (
              <Text component={TextVariants.small}>
                <Text
                  className="pf-u-ml-lg"
                  component={TextVariants.a}
                  isVisitedLink
                  href="#"
                >
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
