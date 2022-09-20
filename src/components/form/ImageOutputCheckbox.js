import React, { Fragment, useCallback } from 'react';
import {
  FormGroup,
  Checkbox,
  TextContent,
  Text,
  TextVariants,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import PropTypes from 'prop-types';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const WarningInstallerHelperText = () => (
  <HelperText className="pf-u-ml-lg">
    <HelperTextItem className="pf-u-pb-md" variant="warning" hasIcon>
      Creating an installable version of your image increases the build time and
      is not needed for updating existing systems. <br />
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
        <Fragment key={index}>
          <Checkbox
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
          </TextContent>
          {value === 'rhel-edge-installer' && (
            <Fragment>
              <Text component={TextVariants.small}>
                <Text
                  target="_blank"
                  href="https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html-single/composing_installing_and_managing_rhel_for_edge_images/index#edge-how-to-compose-and-deploy-a-rhel-for-edge-image_introducing-rhel-for-edge-images"
                  component={TextVariants.a}
                  isVisitedLink
                >
                  Learn more about image types.
                  <ExternalLinkAltIcon className="pf-u-ml-sm" />
                </Text>
              </Text>
            </Fragment>
          )}
        </Fragment>
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
