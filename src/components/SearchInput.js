import React, { Fragment, useState } from 'react';
import {
  HelperText,
  HelperTextItem,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useApi from '../hooks/useApi';
import { getGroups } from '../api/groups';
import { debounce } from 'lodash';

const SelectInput = (props) => {
  useFieldApi(props);
  const { change } = useFormApi();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [{ data, isLoading }, fetchGroups] = useApi({ api: getGroups });
  const [searchTerm, setSearchTerm] = useState('');

  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const onSelect = (_event, selection, isPlaceholder) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection);
      setIsOpen(false);
    }
    change('group', selection);
  };

  const clearSelection = () => {
    setSelected(null);
    change('group', null);
    setIsOpen(false);
    setSearchTerm('');
  };

  const onFilter = (_event, value) => {
    /* This handler is called on input changes as well as when children change.
       _event is null when the children change. Only update searchTerm state
       if there was an actual input change.
    */
    if (_event && value != searchTerm) {
      setSearchTerm(value);
      fetchGroups({ name: encodeURIComponent(value) });
    }
  };

  const options = data?.data || [];
  const totalCount = data?.count || 0;

  return (
    <Fragment>
      <HelperText>
        {!isLoading && !selected && totalCount > options.length ? (
          <HelperTextItem variant="warning">
            Over {options.length} results found. Refine your search.
          </HelperTextItem>
        ) : (
          // Add empty helper text to prevent changes in vertical alignment
          <HelperTextItem className="pf-u-pt-lg"></HelperTextItem>
        )}
      </HelperText>
      <Select
        variant="typeahead"
        typeAheadAriaLabel="Select a state"
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={selected}
        isOpen={isOpen}
        onFilter={debounce(onFilter, 300)}
        aria-labelledby="typeahead-select-id-1"
        placeholderText="Type or click to select a group"
        noResultsFoundText={isLoading ? 'Loading...' : 'No results found'}
      >
        {isLoading
          ? []
          : options?.map(({ DeviceGroup }) => (
              <SelectOption
                key={DeviceGroup.ID}
                value={{
                  toString: () => DeviceGroup.Name,
                  groupId: DeviceGroup.ID,
                }}
                {...(DeviceGroup.description && {
                  description: DeviceGroup.description,
                })}
              />
            ))}
      </Select>
    </Fragment>
  );
};

export default SelectInput;
