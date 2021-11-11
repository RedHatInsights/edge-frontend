import React, { useState, useRef, useEffect } from 'react';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { DualListSelector, Button, TextContent } from '@patternfly/react-core';
import { getPackages } from '../../api';
import PropTypes from 'prop-types';

const mapPackagesToComponent = (packages) =>
  packages.map((pack, key) => (
    <TextContent key={`${pack.name}-${key}`}>
      <span className="pf-c-dual-list-selector__item-text">{pack.name}</span>
      <small>{pack.summary}</small>
    </TextContent>
  ));

const mapComponentToPackage = (component) => ({
  name: component.props.children[0].props.children,
  summary: component.props.children[1].props.children,
});

const Packages = ({ defaultArch, ...props }) => {
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const packagesSearchName = useRef();
  const [packagesAvailable, setPackagesAvailable] = useState([]);
  const [packagesSelected, setPackagesSelected] = useState([]);
  const [filterSelected, setFilterSelected] = useState('');
  const [enterPressed, setEnterPressed] = useState(false);
  const [availableSelected, setAvailableSelected] = useState([]);
  const [chosenSelected, setChosenSelected] = useState([]);

  useEffect(() => {
    setPackagesSelected(
      mapPackagesToComponent(getState()?.values?.[input.name] || [])
    );
    const availableSearchInput = document.querySelector(
      '[aria-label="Available search input"]'
    );
    availableSearchInput?.addEventListener('keydown', handleSearchOnEnter);
    return () =>
      availableSearchInput.removeEventListener('keydown', handleSearchOnEnter);
  }, []);

  useEffect(() => {
    if (enterPressed) {
      handlePackagesSearch();
      setEnterPressed(false);
    }
  }, [enterPressed]);

  const updateSelect = (prevState, id) =>
    prevState.includes(id)
      ? prevState.filter((entity) => entity !== id)
      : [...prevState, id];

  const onOptionSelect = (e) => {
    const id = e.target.offsetParent.id;
    if (id.split('-')[1] === 'available') {
      setAvailableSelected((prevState) => updateSelect(prevState, id));
    } else {
      setChosenSelected((prevState) => updateSelect(prevState, id));
    }
  };

  const packageListChange = (newAvailablePackages, newChosenPackages) => {
    const chosenPkgs = newChosenPackages.map(mapComponentToPackage);
    setPackagesAvailable(newAvailablePackages);
    setPackagesSelected(newChosenPackages);
    change(input.name, chosenPkgs);
  };

  const addAllPackages = (allAvailablePackages) => {
    setPackagesAvailable([]);
    setPackagesSelected((prevState = []) => [
      ...allAvailablePackages,
      ...prevState,
    ]);
    const chosenPkgs = allAvailablePackages.map(mapComponentToPackage);
    change(input.name, chosenPkgs);
  };

  const handlePackagesSearch = async () => {
    const { data } = await getPackages(
      getState()?.values?.release || 'rhel-8',
      getState()?.values?.architecture || defaultArch,
      packagesSearchName.current
    );
    const removeChosen = data.filter(
      (pack) =>
        !packagesSelected.some(
          (chosenPkg) =>
            chosenPkg.props.children[0].props.children === pack.name
        )
    );
    setPackagesAvailable(mapPackagesToComponent(removeChosen || []));
  };

  const handleSearchOnEnter = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      setEnterPressed(true);
    }
  };

  return (
    <DualListSelector
      className="pf-u-mt-sm"
      isSearchable
      availableOptionsActions={[
        <Button
          aria-label="Search button for available packages"
          key="availableSearchButton"
          data-testid="search-pkgs-button"
          onClick={handlePackagesSearch}
        >
          Search
        </Button>,
      ]}
      onOptionSelect={onOptionSelect}
      onListChange={() => {
        setAvailableSelected([]);
        setChosenSelected([]);
      }}
      availableOptions={packagesAvailable}
      availableOptionsTitle="Available packages"
      chosenOptions={packagesSelected.filter((item) =>
        mapComponentToPackage(item)?.name?.includes(filterSelected)
      )}
      chosenOptionsTitle="Chosen packages"
      addSelected={packageListChange}
      availableOptionsStatus={
        availableSelected.length
          ? `${availableSelected.length} of ${packagesAvailable.length} items`
          : `${packagesAvailable.length} items`
      }
      chosenOptionsStatus={
        chosenSelected.length
          ? `${chosenSelected.length} of ${packagesSelected.length} items`
          : `${packagesSelected.length} items`
      }
      removeSelected={packageListChange}
      addAll={(allAvailablePackages) => addAllPackages(allAvailablePackages)}
      removeAll={(newAvailablePackages) =>
        packageListChange(
          newAvailablePackages,
          packagesSelected.filter(
            (item) =>
              !mapComponentToPackage(item)?.name?.includes(filterSelected)
          )
        )
      }
      onAvailableOptionsSearchInputChanged={(val) => {
        packagesSearchName.current = val;
      }}
      onChosenOptionsSearchInputChanged={(val) => setFilterSelected(val)}
      filterOption={() => true}
      id="basicSelectorWithSearch"
    />
  );
};

Packages.propTypes = {
  defaultArch: PropTypes.string,
};

export default Packages;
