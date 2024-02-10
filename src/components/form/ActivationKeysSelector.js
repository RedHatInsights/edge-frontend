import React, { useEffect, Fragment, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';
import {
  FormGroup,
  TextArea,
  Text,
  TextVariants,
  Select,
  SelectOption,
  Button,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { fetchActivationKeys } from '../../api/images';



const ActivationKeysField = (props) => {
  const [activationKey, setActivationKey] = useState(null);

  const [activationKeyList, setActivationKeyList] = useState(null);
  // ********************************************************* //
  const [isOpen, setIsOpen] = useState(false);
  
  const [selected, setSelected] = useState(null);
  
  (async () => {
    const data = await fetchActivationKeys(10);
    setActivationKey(data);
  })();
  const optionKeys = [];

  useEffect(() => {
    if (activationKey != null) {
      activationKey.body.forEach((key) => {
        optionKeys.push({
          value: key.name,
          label: key.name,
        });
      });
      setActivationKeyList(optionKeys);
    }
  }, [activationKey]);

  console.log(activationKeyList);
  
  const handleToggle = () => setIsOpen(!isOpen);

  const onSelect = (_event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
    }
  };
  
  // ********************************************************* //
  const { input: activationKeySelect, meta } = useFieldApi({
    name: 'activationKeys',
    ...props,
  });

  const ManageKeysButton = () => {
    return (
      <Button
        component="a"
        target="_blank"
        variant="link"
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        isInline
        href={
          // isProd()
          // ? 'https://console.redhat.com/insights/connector/activation-keys'
          'https://console.stage.redhat.com/insights/connector/activation-keys'
        }
      >
        Activation keys page
      </Button>
    );
  };
  return (
    <FormGroup>
      <FormGroup
        label="Activation key to use for this image"
        helperTextInvalid={meta.error}
        validated={meta.error && meta.touched ? 'error' : 'default'}
      >
        <Select
          variant="single"
          width="100%"
          onToggle={handleToggle}
          onSelect={onSelect}
          selections={  selected }
          isOpen={isOpen}
          style={{ paddingLeft: 0, marginLeft: 0 }}
        >
          {activationKeyList?.map((item) => (
            <SelectOption key={item.value} value={item.value}>
              {item.label}
            </SelectOption>
          ))}
        </Select>

        
      </FormGroup>
      <br />
      <Fragment>
        <Text>
          <Text>
            By default, activation key is generated and preset for you. Admins
            can create and manage keys by visiting the <ManageKeysButton />
          </Text>
        </Text>
      </Fragment>
    </FormGroup>
  );
};

export default ActivationKeysField;
