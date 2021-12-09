import React, { useState, useEffect } from 'react';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { getPackages } from '../../api';
import PropTypes from 'prop-types';
import {
  TextContent,
  Text,
  Button,
  DualListSelector,
  DualListSelectorPane,
  DualListSelectorList,
  DualListSelectorListItem,
  DualListSelectorControlsWrapper,
  DualListSelectorControl,
  HelperText,
  HelperTextItem,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import AngleDoubleLeftIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-left-icon';
import AngleLeftIcon from '@patternfly/react-icons/dist/esm/icons/angle-left-icon';
import AngleDoubleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-right-icon';
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import { sortByDirection as sortedOptions } from '../../constants';

const EmptyText = ({ text }) => (
  <Text className="pf-u-text-align-center pf-u-pr-xl pf-u-pl-xl pf-u-pt-xl">
    {text}
  </Text>
);

EmptyText.propTypes = {
  text: PropTypes.string,
};

const NoResultsText = ({ heading, body }) => (
  <TextContent className="pf-u-text-align-center pf-u-pr-xl pf-u-pl-xl pf-u-pt-xl">
    <Text component="h3">{heading}</Text>
    <Text component="small">{body}</Text>
  </TextContent>
);

NoResultsText.propTypes = {
  heading: PropTypes.string,
  body: PropTypes.string,
};

const mapPackagesToOptions = (pkgs) =>
  pkgs.map((pkg) => ({
    selected: false,
    isVisible: true,
    ...pkg,
  }));

const Packages = ({ defaultArch, ...props }) => {
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const [availableOptions, setAvailableOptions] = React.useState([]);
  const [chosenOptions, setChosenOptions] = React.useState([]);
  const [availableInputValue, setAvailableInputValue] = React.useState('');
  const [enterPressed, setEnterPressed] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [scrollTo, setScrollTo] = useState(null);
  const [hasNoSearchResults, setHasNoSearchResults] = useState(false);

  useEffect(() => {
    const loadedPackages = getState()?.values?.[input.name] || [];
    setChosenOptions(sortedOptions(mapPackagesToOptions(loadedPackages)));

    const availableSearchInput = document.querySelector(
      '[aria-label="available search input"]'
    );

    availableSearchInput?.addEventListener('keydown', handleSearchOnEnter);
    return () =>
      availableSearchInput.removeEventListener('keydown', handleSearchOnEnter);
  }, []);

  useEffect(() => {
    if (enterPressed) {
      handlePackageSearch();
      setEnterPressed(false);
    }
  }, [enterPressed]);

  useEffect(() => {
    scrollToAddedPackages();
  }, [scrollTo]);

  const handlePackageSearch = async () => {
    if (availableInputValue === '') {
      return;
    }

    const { data, meta } = await getPackages(
      getState()?.values?.release || 'rhel-84',
      getState()?.values?.architecture || defaultArch,
      availableInputValue
    );

    if (!data) {
      setHasNoSearchResults(true);
      setHasMoreResults(false);
      setAvailableOptions([]);
      return;
    }

    if (meta.count > 100) {
      setHasMoreResults(true);
    } else setHasMoreResults(false);

    const removeChosenPackages = data.filter(
      (newPkg) =>
        !chosenOptions.find((chosenPkg) => chosenPkg.name === newPkg.name)
    );
    setAvailableOptions(
      sortedOptions(mapPackagesToOptions(removeChosenPackages))
    );

    setHasNoSearchResults(false);
  };

  const handleSearchOnEnter = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      setEnterPressed(true);
    }
  };

  const scrollToAddedPackages = () => {
    if (!scrollTo) {
      return;
    }

    const destination = document.querySelector(
      `.pf-m-${scrollTo.pane} .pf-c-dual-list-selector__menu`
    );
    scrollTo.pkgs.forEach((pkg) =>
      document
        .querySelector(`#package-${pkg.name}`)
        .closest('.pf-c-dual-list-selector__list-item-row')
        .classList.add('pf-u-background-color-disabled-color-300')
    );
    setTimeout(() => {
      scrollTo.pkgs.forEach((pkg) =>
        document
          .querySelector(`#package-${pkg.name}`)
          .closest('.pf-c-dual-list-selector__list-item-row')
          .classList.remove('pf-u-background-color-disabled-color-300')
      );
    }, 400);
    destination.scrollTop = scrollTo.scrollHeight;

    setScrollTo(null);
  };

  const moveSelected = (fromAvailable) => {
    const sourceOptions = fromAvailable ? availableOptions : chosenOptions;
    let destinationOptions = fromAvailable ? chosenOptions : availableOptions;

    const selectedOptions = [];
    for (let i = 0; i < sourceOptions.length; i++) {
      const option = sourceOptions[i];
      if (option.selected && option.isVisible) {
        selectedOptions.push(option);
        sourceOptions.splice(i, 1);
        option.selected = false;
        i--;
      }
    }

    destinationOptions = sortedOptions([
      ...destinationOptions,
      ...selectedOptions,
    ]);

    const packageHeight = 61;
    const scrollHeight =
      destinationOptions.findIndex(
        (pkg) => pkg.name === selectedOptions[0].name
      ) * packageHeight;

    if (fromAvailable) {
      setAvailableOptions(sortedOptions([...sourceOptions]));
      setChosenOptions(destinationOptions);
    } else {
      setChosenOptions(sortedOptions([...sourceOptions]));
      setAvailableOptions(destinationOptions);
    }
    change(input.name, chosenOptions);
    setScrollTo({
      pkgs: selectedOptions,
      pane: fromAvailable ? 'chosen' : 'available',
      scrollHeight,
    });
  };

  const moveAll = (fromAvailable) => {
    if (fromAvailable) {
      setChosenOptions(
        sortedOptions([
          ...availableOptions.filter((x) => x.isVisible),
          ...chosenOptions,
        ])
      );
      setAvailableOptions(
        sortedOptions([...availableOptions.filter((x) => !x.isVisible)])
      );
      change(input.name, availableOptions);
    } else {
      setAvailableOptions(
        sortedOptions([
          ...chosenOptions.filter((x) => x.isVisible),
          ...availableOptions,
        ])
      );
      setChosenOptions(
        sortedOptions([...chosenOptions.filter((x) => !x.isVisible)])
      );
      change(input.name, []);
    }
  };

  const onOptionSelect = (_event, index, isChosen) => {
    if (isChosen) {
      const newChosen = [...chosenOptions];
      newChosen[index].selected = !chosenOptions[index].selected;
      setChosenOptions(sortedOptions(newChosen));
    } else {
      const newAvailable = [...availableOptions];
      newAvailable[index].selected = !availableOptions[index].selected;
      setAvailableOptions(sortedOptions(newAvailable));
    }
  };

  const buildSearchInput = (isAvailable) => {
    const onChange = (value) => {
      setAvailableInputValue(value);
      if (!isAvailable) {
        const toFilter = [...chosenOptions];
        toFilter.forEach((option) => {
          option.isVisible =
            value === '' ||
            option.name.toLowerCase().includes(value.toLowerCase());
        });
      }
    };

    return (
      <>
        <InputGroup>
          <TextInput
            id={`${isAvailable ? 'available' : 'chosen'}-textinput`}
            type="search"
            onChange={onChange}
            placeholder="Search for packages"
            validated={hasMoreResults && isAvailable ? 'warning' : ''}
            aria-label={
              isAvailable ? 'available search input' : 'chosen search input'
            }
            data-testid={
              isAvailable ? 'available-search-input' : 'chosen-search-input'
            }
          />
          {isAvailable ? (
            <Button
              onClick={handlePackageSearch}
              isDisabled={!isAvailable}
              variant="control"
              aria-label="search button for search input"
              data-testid="package-search"
            >
              <SearchIcon />
            </Button>
          ) : (
            <InputGroupText>
              <SearchIcon className="pf-u-ml-xs pf-u-mr-xs" />
            </InputGroupText>
          )}
        </InputGroup>
        {hasMoreResults && isAvailable && (
          <HelperText>
            <HelperTextItem variant="warning">
              First 100 results displayed. Please, refine your search
            </HelperTextItem>
          </HelperText>
        )}
      </>
    );
  };

  const selectedStatus = (options) => {
    const totalItemNum = options.filter((x) => x.isVisible).length;
    const selectedItemNum = options.filter(
      (x) => x.selected && x.isVisible
    ).length;
    return selectedItemNum > 0
      ? `${selectedItemNum} of ${totalItemNum} items selected`
      : `${totalItemNum} ${totalItemNum > 1 ? 'items' : 'item'}`;
  };

  return (
    <DualListSelector>
      <DualListSelectorPane
        title="Available packages"
        status={selectedStatus(availableOptions)}
        searchInput={buildSearchInput(true)}
      >
        <DualListSelectorList
          style={{ height: '290px' }}
          data-testid="available-packages-list"
        >
          {availableOptions.length > 0 ? (
            availableOptions.map((option, index) => {
              return option.isVisible ? (
                <DualListSelectorListItem
                  key={index}
                  isSelected={option.selected}
                  id={`composable-option-${index}`}
                  onOptionSelect={(e) => onOptionSelect(e, index, false)}
                >
                  <TextContent>
                    <span
                      id={`package-${option.name}`}
                      className="pf-c-dual-list-selector__item-text"
                    >
                      {option.name}
                    </span>
                    <small>{option.summary}</small>
                  </TextContent>
                </DualListSelectorListItem>
              ) : null;
            })
          ) : hasNoSearchResults ? (
            <NoResultsText
              heading="No Results Found"
              body="Adjust your search and try again"
            />
          ) : (
            <EmptyText text="Search above to add additional packages to your image." />
          )}
        </DualListSelectorList>
      </DualListSelectorPane>

      <DualListSelectorControlsWrapper aria-label="Selector controls">
        <DualListSelectorControl
          isDisabled={!availableOptions.some((option) => option.selected)}
          onClick={() => moveSelected(true)}
          aria-label="Add selected"
          tooltipContent="Add selected"
        >
          <AngleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={availableOptions.length === 0}
          onClick={() => moveAll(true)}
          aria-label="Add all"
          tooltipContent="Add all"
        >
          <AngleDoubleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={chosenOptions.length === 0}
          onClick={() => moveAll(false)}
          aria-label="Remove all"
          tooltipContent="Remove all"
        >
          <AngleDoubleLeftIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          onClick={() => moveSelected(false)}
          isDisabled={!chosenOptions.some((option) => option.selected)}
          aria-label="Remove selected"
          tooltipContent="Remove selected"
        >
          <AngleLeftIcon />
        </DualListSelectorControl>
      </DualListSelectorControlsWrapper>

      <DualListSelectorPane
        title="Chosen packages"
        status={selectedStatus(chosenOptions)}
        searchInput={buildSearchInput(false)}
        isChosen
      >
        <DualListSelectorList
          style={{ height: '290px' }}
          data-testid="chosen-packages-list"
        >
          {chosenOptions.length === 0 ? (
            <EmptyText text="No packages added." />
          ) : chosenOptions.filter((option) => option.isVisible).length > 0 ? (
            chosenOptions.map((option, index) => {
              return option.isVisible ? (
                <DualListSelectorListItem
                  key={index}
                  isSelected={option.selected}
                  id={`composable-option-${index}`}
                  onOptionSelect={(e) => onOptionSelect(e, index, true)}
                >
                  <TextContent>
                    <span
                      id={`package-${option.name}`}
                      className="pf-c-dual-list-selector__item-text"
                    >
                      {option.name}
                    </span>
                    <small>{option.summary}</small>
                  </TextContent>
                </DualListSelectorListItem>
              ) : null;
            })
          ) : (
            <NoResultsText
              heading="No Results Found"
              body="Adjust your search and try again"
            />
          )}
        </DualListSelectorList>
      </DualListSelectorPane>
    </DualListSelector>
  );
};

Packages.propTypes = {
  defaultArch: PropTypes.string,
};

export default Packages;
