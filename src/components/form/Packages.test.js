import React from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import Packages from './Packages';
import { render, screen } from '@testing-library/react';
import { componentMapper } from '@data-driven-forms/pf4-component-mapper';

const renderPackages = (initialValues = {}) => {
  render(
    <FormRenderer
      schema={{
        fields: [
          {
            component: 'package-selector',
            name: 'selected-packages',
          },
        ],
      }}
      componentMapper={{
        ...componentMapper,
        'package-selector': {
          component: Packages,
          defaultArch: 'x86_64',
        },
      }}
      FormTemplate={(props) => (
        <Pf4FormTemplate {...props} showFormControls={false} />
      )}
      onSubmit={console.log}
      initialValues={initialValues}
    />
  );
};

describe('Packages', () => {
  it('should render correctly', () => {
    renderPackages();
  });

  it('should render a package when initialValues is populated', () => {
    renderPackages({
      'selected-packages': [{ name: 'my test package' }],
    });
    expect(
      screen.getByTestId('chosen-packages-list').children[0].textContent
    ).toEqual('my test package');
  });
});
