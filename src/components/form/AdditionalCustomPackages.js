import React, { useState, useEffect } from 'react';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import { postRpmsNames } from '../../api/images';
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
  Divider,
} from '@patternfly/react-core';
import {
  ArrowRightIcon,
  AngleDoubleLeftIcon,
  AngleLeftIcon,
  AngleDoubleRightIcon,
  AngleRightIcon,
} from '@patternfly/react-icons';
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
    name: pkg.package_name || pkg.name,
    summary: pkg.summary,
  }));

const AdditionalCustomPackages = ({ defaultArch, ...props }) => {
  const { change, getState } = useFormApi();
  const { input } = useFieldApi(props);
  const [availableOptions, setAvailableOptions] = React.useState([]);
  const [chosenOptions, setChosenOptions] = React.useState([]);
  const [availableInputValue, setAvailableInputValue] = React.useState('');
  const [enterPressed, setEnterPressed] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [scrollTo, setScrollTo] = useState(null);
  const [hasNoSearchResults, setHasNoSearchResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [exactMatch, setExactMatch] = useState(false);

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

    const data = await postRpmsNames(
      (getState()?.values?.['third-party-repositories'] || [])?.map(
        ({ URL }) => URL
      ),
      availableInputValue
    );

    setHasMoreResults(false);
    setExactMatch(false);
    setHasNoSearchResults(false);

    if (!data) {
      setHasNoSearchResults(true);
      setAvailableOptions([]);
      return;
    }

    if (data.length > 100) {
      setHasNoSearchResults(false);
      setHasMoreResults(true);

      let exactMatchIndex = null;
      data.forEach(({ package_name }, index) => {
        if (package_name === availableInputValue) {
          exactMatchIndex = index;
          return;
        }
      });

      const isNotChosen = !chosenOptions.find(
        (option) => option.name === data[exactMatchIndex].name
      );
      if (exactMatchIndex !== null && isNotChosen) {
        setExactMatch(true);
        setAvailableOptions(mapPackagesToOptions([data[exactMatchIndex]]));
        return;
      }

      setAvailableOptions([]);
      return;
    }

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
        .getElementById(`package-${pkg.name}`)
        .closest('.pf-c-dual-list-selector__list-item-row')
        .classList.add('pf-u-background-color-disabled-color-300')
    );
    setTimeout(() => {
      scrollTo.pkgs.forEach((pkg) =>
        document
          .getElementById(`package-${pkg.name}`)
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
      change(input.name, destinationOptions);
    } else {
      setChosenOptions(sortedOptions([...sourceOptions]));
      setAvailableOptions(destinationOptions);
      change(input.name, [...sourceOptions]);
    }
    setScrollTo({
      pkgs: selectedOptions,
      pane: fromAvailable ? 'chosen' : 'available',
      scrollHeight,
    });
    setExactMatch(false);
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
      change(input.name, [...availableOptions, ...chosenOptions]);
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
    setExactMatch(false);
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
            type="arrow"
            onChange={onChange}
            placeholder="Search for packages"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            validated={
              hasMoreResults && isAvailable && !searchFocused ? 'warning' : ''
            }
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
              aria-label="search button for additional custom packages"
              data-testid="package-search"
            >
              <ArrowRightIcon />
            </Button>
          ) : (
            <InputGroupText>
              <ArrowRightIcon className="pf-u-ml-xs pf-u-mr-xs" />
            </InputGroupText>
          )}
        </InputGroup>
        {hasMoreResults && isAvailable && (
          <HelperText>
            <HelperTextItem variant="warning">
              Over 100 results found. Refine your search.
            </HelperTextItem>
          </HelperText>
        )}
      </>
    );
  };

  const displayPackagesFrom = (options, isChosen) => {
    return options.map((option, index) => {
      return option.isVisible ? (
        <DualListSelectorListItem
          key={index}
          isSelected={option.selected}
          id={`composable-option-${index}`}
          onOptionSelect={(e) => onOptionSelect(e, index, isChosen)}
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
    });
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
          {availableOptions.length > 0 && !exactMatch ? (
            displayPackagesFrom(availableOptions, false)
          ) : hasNoSearchResults ? (
            <NoResultsText
              heading="No Results Found"
              body="Adjust your search and try again"
            />
          ) : hasMoreResults ? (
            <>
              {exactMatch && (
                <HelperText>
                  <HelperTextItem
                    className="pf-u-ml-md pf-u-mt-md"
                    variant="indeterminate"
                  >
                    Exact match
                  </HelperTextItem>
                </HelperText>
              )}
              {exactMatch && displayPackagesFrom(availableOptions, false)}
              {exactMatch && (
                <Divider
                  className="pf-u-mt-md"
                  inset={{ default: 'insetMd' }}
                />
              )}

              <NoResultsText
                heading="Too many results to display"
                body="Please make the search more specific and try again"
              />
            </>
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
            displayPackagesFrom(chosenOptions, true)
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

AdditionalCustomPackages.propTypes = {
  defaultArch: PropTypes.string,
};

export default AdditionalCustomPackages;
