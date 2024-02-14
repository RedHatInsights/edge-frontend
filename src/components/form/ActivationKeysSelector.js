import React, { useEffect, Fragment, useState } from 'react';

import {
  FormGroup,
  Text,
  Select,
  SelectOption,
  Button,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { fetchActivationKeys } from '../../api/images';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const ActivationKeysField = () => {
  const { change, getState } = useFormApi();
  const key = getState()?.values?.activationKey || '';
  const [activationKeyData, setActivationKeyData] = useState({});
  const [activationKeyList, setActivationKeyList] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(key);
  const [isUpdate, setIsUpdate] = useState(false);
  useEffect(() => {
    if (getState()?.initialValues?.isUpdate) {
      setIsUpdate(true);
    } else {
      (async () => {
        const data = await fetchActivationKeys();
        setActivationKeyData(data);
      })();
    }
  }, []);

  const optionKeys = [];

  useEffect(() => {
    if (activationKeyData != null) {
      optionKeys.push({ value: null, label: 'Select activation key' });
      activationKeyData?.body?.forEach((key) => {
        optionKeys.push({
          value: key.name,
          label: key.name,
        });
      });
      setActivationKeyList(optionKeys);
    }
  }, [activationKeyData]);

  const handleToggle = () => setIsOpen(!isOpen);

  const onSelect = (_event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
      change('activationKey', selection);
    }
  };

  const clearSelection = () => {
    setSelected(null);
    setIsOpen(false);
  };

  const ManageKeysButton = () => {
    return (
      <Button
        component="a"
        target="_blank"
        variant="link"
        icon={<ExternalLinkAltIcon />}
        iconPosition="right"
        isInline
        href={`https://${window.location.host}/insights/connector/activation-keys`}
      >
        Activation keys page
      </Button>
    );
  };
  return (
    <FormGroup>
      <FormGroup label="Activation key to use for this image">
        <Select
          variant="single"
          width="100%"
          onToggle={handleToggle}
          onSelect={onSelect}
          selections={selected}
          isOpen={isOpen}
          style={{ paddingLeft: 0, marginLeft: 0 }}
          placeholderText="Select activation key"
          isDisabled={isUpdate}
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
