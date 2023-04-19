/* eslint-disable react/display-name */
import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';
import { Spinner } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import Review from './form/ReviewStep';
import Packages from './form/Packages';
import AdditionalCustomPackages from './form/AdditionalCustomPackages';
import WizardRepositoryTable from './form/WizardRepositoryTable';
import RegistrationCreds from './form/RegistrationCreds';
import ImageOutputCheckbox from './form/ImageOutputCheckbox';
import SSHInputField from './form/SSHInputField';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { registrationCredsValidator } from './form/RegistrationCreds';
import { reservedUsernameValidator } from './form/validators';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import CustomPackageTextArea from './form/CustomPackageTextArea';

/**
 * Use this instead of CreateImageWizard once this PR is merged https://github.com/RedHatInsights/image-builder-frontend/pull/230
 * @returns Async component
 */
export const AsyncCreateImageWizard = (props) => (
  <AsyncComponent
    appName="image-builder"
    scope="image_builder"
    module="./ImageCreator"
    fallback={<Spinner />}
    {...props}
  />
);

const CreateImageWizard = ({
  schema,
  onSubmit,
  onClose,
  customComponentMapper,
  initialValues,
  defaultArch,
}) => {
  return schema ? (
    <FormRenderer
      schema={schema}
      className="image-builder"
      subscription={{ values: true }}
      FormTemplate={(props) => (
        <Pf4FormTemplate {...props} showFormControls={false} />
      )}
      onSubmit={(formValues) => onSubmit(formValues)}
      initialValues={initialValues}
      componentMapper={{
        ...componentMapper,
        // wizard: WrappedWizard,
        'registration-creds': {
          component: RegistrationCreds,
        },
        'image-output-checkbox': {
          component: ImageOutputCheckbox,
        },
        'ssh-input-field': {
          component: SSHInputField,
        },
        review: Review,
        'package-selector': {
          component: Packages,
          defaultArch,
        },
        'custom-repo-table': {
          component: WizardRepositoryTable,
        },
        'custom-package-text-area': {
          component: CustomPackageTextArea,
        },
        'additional-custom-packages': {
          component: AdditionalCustomPackages,
        },
        ...customComponentMapper,
      }}
      validate={(values) => {
        const errors = {};
        if (
          values['validate-custom-repos'] &&
          values['custom-packages']?.length > 0 &&
          values['third-party-repositories']?.length === 0
        ) {
          errors['custom-packages'] = 'No custom repositories linked';
        }
        return errors;
      }}
      validatorMapper={{
        ...validatorTypes,
        registrationCredsValidator,
        reservedUsernameValidator,
      }}
      onCancel={onClose}
    />
  ) : (
    <Spinner />
  );
};

CreateImageWizard.propTypes = {
  schema: PropTypes.object,
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  customComponentMapper: PropTypes.shape({
    [PropTypes.string]: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.shape({
        component: PropTypes.node,
      }),
    ]),
  }),
  defaultArch: PropTypes.string,
};

export default CreateImageWizard;
