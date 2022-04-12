import React, { useEffect, useState } from 'react';
import { FormGroup, TextArea } from '@patternfly/react-core';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

const CustomPackageTextArea = ({ ...props }) => {
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const wizardState = getState()?.values?.[input.name];
  const [value, setValue] = useState(
    wizardState?.map((repo) => repo.name).join('\n')
  );

  useEffect(() => {
    const customRepoArray = value
      .split(/[/,/\n\r\s\t]+/g)
      .reduce((acc, repo) => {
        const onlyText = repo.replace(/[/ /\n\r\s\t]+/g, '');
        if (onlyText !== '' && onlyText !== '\n') {
          return (acc = [...acc, { name: `${onlyText}` }]);
        }
        return acc;
      }, []);
    change(input.name, customRepoArray);
  }, [value]);

  useEffect(() => {
    const availableSearchInput = document.querySelector(
      '[aria-label="custom-package-wizard-step"]'
    );

    availableSearchInput?.addEventListener('keydown', handleSearchOnEnter);
    return () =>
      availableSearchInput.removeEventListener('keydown', handleSearchOnEnter);
  }, []);

  const handleSearchOnEnter = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  return (
    <FormGroup label="Packages" type="string">
      <TextArea
        aria-label="custom-package-wizard-step"
        placeholder="Enter or paste packages from linked repositories, one entry per line.&#13;ExamplePackage&#13;example-package&#13;examplapackage"
        value={value}
        onChange={(newValue) => setValue(newValue)}
        style={{
          paddingRight: '32px',
          height: '25vh',
        }}
      ></TextArea>
    </FormGroup>
  );
};

export default CustomPackageTextArea;
