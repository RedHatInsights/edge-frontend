import React, { useEffect, useState } from 'react';
import {
  HelperText,
  HelperTextItem,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useApi from '../hooks/useApi';
import { getGroups, getInventoryGroups } from '../api/groups';
import { debounce } from 'lodash';
import useInventoryGroups from '../hooks/useInventoryGroups';

const SelectInput = (props) => {
  useFieldApi(props);
  const [inventoryGroupsEnabled] = useInventoryGroups(false);

  const { change } = useFormApi();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [{ data, isLoading }, fetchGroups, apiFunc, setAPIFunc] = useApi({
    api: inventoryGroupsEnabled ? getInventoryGroups : getGroups,
    tableReload: true,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const onToggle = (isOpen) => {
    setIsOpen(isOpen);
  };

  const updateSelection = (value) => {
    // Update state when an option has been selected.
    setSelected(value);
    setIsOpen(false);
    change('group', value);
  };

  const onSelect = (_event, selection) => {
    if (_event) updateSelection(selection);
  };

  const clearSelection = () => {
    setSearchTerm('');
    fetchGroups();
    updateSelection(null);
  };

  useEffect(() => {
    // set the new api function when inventoryGroupsEnabled value change
    setAPIFunc(() => (inventoryGroupsEnabled ? getInventoryGroups : getGroups));
  }, [inventoryGroupsEnabled]);

  useEffect(() => {
    // re-initiate the search widget data when api function change
    clearSelection();
  }, [apiFunc]);

  const onFilter = (_event, value) => {
    /* This handler is called on input changes as well as when children change.
       _event is null when the children change. Only update searchTerm state
       and fetch results from the API only if there was an actual input change.
    */
    if (_event && value != searchTerm) {
      setSearchTerm(value);
      fetchGroups({ name: encodeURIComponent(value) });
    }
  };

  const options = (inventoryGroupsEnabled ? data?.results : data?.data) || [];
  const totalCount = (inventoryGroupsEnabled ? data?.total : data?.count) || 0;

  return (
    <>
      <HelperText>
        {!isLoading && !selected && isOpen && totalCount > options.length ? (
          <HelperTextItem variant="warning" className="pf-u-font-weight-bold">
            Over {options.length} results found. Refine your search.
          </HelperTextItem>
        ) : (
          <HelperTextItem className="pf-u-font-weight-bold">
            Select a group
          </HelperTextItem>
        )}
      </HelperText>
      <Select
        variant="typeahead"
        typeAheadAriaLabel="Select a group"
        onToggle={onToggle}
        onSelect={onSelect}
        onClear={clearSelection}
        selections={selected ? selected : searchTerm}
        isOpen={isOpen}
        onFilter={debounce(onFilter, 300)}
        aria-labelledby="typeahead-select-id-1"
        placeholderText="Type or click to select a group"
        noResultsFoundText={isLoading ? 'Loading...' : 'No results found'}
        isInputValuePersisted={true}
        maxHeight={'180px'}
      >
        {isLoading
          ? []
          : options?.map(({ id, name, DeviceGroup }) => (
              // note: the schema is different when fetching groups from inventory or from edge-api
              <SelectOption
                key={inventoryGroupsEnabled ? id : DeviceGroup.ID}
                value={{
                  toString: () =>
                    inventoryGroupsEnabled ? name : DeviceGroup.Name,
                  groupId: inventoryGroupsEnabled ? id : DeviceGroup.ID,
                }}
              />
            ))}
      </Select>
    </>
  );
};

export default SelectInput;
