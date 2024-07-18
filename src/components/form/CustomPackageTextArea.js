import React, { useState } from 'react';
import { FormGroup, TextArea } from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';

const CustomPackageTextArea = (props) => {
  const { input } = useFieldApi(props);
  const [value, setValue] = useState(
    input.value.map((pkg) => pkg.name).join('\n')
  );

  const onChange = (newValue) => {
    // Split text area value on whitespace or commas to get package names
    const packageNames = newValue.split(/[,\s]+/g).reduce((acc, name) => {
      return name !== '' ? [...acc, { name }] : acc;
    }, []);
    // Store both the formatted array and the original text
    input.onChange(packageNames);
    setValue(newValue);
  };

  const handleSearchOnEnter = (e) => {
    // Allow newlines in text area component
    if (e.key === 'Enter') {
      e.stopPropagation();
    }
  };

  return (
    <FormGroup label="Packages" type="string">
      <TextArea
        aria-label="custom-package-wizard-step"
        placeholder="Enter or paste packages from linked repositories, one entry per line.&#13;ExamplePackage&#13;example-package&#13;examplepackage"
        value={value}
        onChange={(_event, newValue) => onChange(newValue)}
        onKeyDown={handleSearchOnEnter}
        style={{
          paddingRight: '32px',
          height: '25vh',
        }}
      />
    </FormGroup>
  );
};

export default CustomPackageTextArea;
