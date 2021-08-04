import React, { useCallback } from 'react';
import {
  FormGroup,
  Checkbox,
  TextContent,
  Text,
  TextVariants,
  FormHelperText,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import warningColor from '@patternfly/react-tokens/dist/esm/global_warning_color_100';

const WarningInstallerHelperText = () => (
  <FormHelperText
    isHidden={false}
    className='pf-u-ml-xl'
    icon={<ExclamationTriangleIcon color={warningColor.value} />}
  >
    Creating an installable version of your image increases the build time and
    is not needed for updating existing devices. You can create an installable
    version of this image later if you continue with this option
  </FormHelperText>
);

const outputHelperText = {
  'rhel-edge-commit':
    'An OSTree commit is always created when building an image.',
  'rhel-edge-installer':
    'An installable version of the image is typically created with a brand new image.',
  'rhel-edge-installer-warning': `Creating an installable version of your image increases the build time  \
  and is not needed for updating existing devices. \n You can create an installable version of this image later if you continue with this option`,
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
      label='Output type'
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
              {getState()?.initialValues?.isUpdate &&
              value === 'rhel-edge-installer' ? (
                <WarningInstallerHelperText />
              ) : (
                outputHelperText[value]
              )}
            </Text>
            {value === 'rhel-edge-installer' && (
              <Text component={TextVariants.small}>
                <Text
                  className='pf-u-ml-xl'
                  component={TextVariants.a}
                  isVisitedLink
                  href='#'
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
