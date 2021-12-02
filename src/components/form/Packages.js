import React, { useState, useRef, useEffect } from 'react';
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
  SearchInput,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import SearchIcon from '@patternfly/react-icons/dist/esm/icons/search-icon';
import AngleDoubleLeftIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-left-icon';
import AngleLeftIcon from '@patternfly/react-icons/dist/esm/icons/angle-left-icon';
import AngleDoubleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-double-right-icon';
import AngleRightIcon from '@patternfly/react-icons/dist/esm/icons/angle-right-icon';
import PficonSortCommonAscIcon from '@patternfly/react-icons/dist/esm/icons/pficon-sort-common-asc-icon';

const EmptyText = ({ text }) => (
  <Text className='pf-u-text-align-center pf-u-pr-xl pf-u-pl-xl pf-u-pt-xl'>
    {text}
  </Text>
);

const NoResultsText = ({ heading, body }) => (
  <TextContent className='pf-u-text-align-center pf-u-pr-xl pf-u-pl-xl pf-u-pt-xl'>
    <Text component='h3'>{heading}</Text>
    <Text component='small'>{body}</Text>
  </TextContent>
);

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
  const [availableFilter, setAvailableFilter] = React.useState('');
  const [chosenFilter, setChosenFilter] = React.useState('');
  const [enterPressed, setEnterPressed] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [hasNoSearchResults, setHasNoSearchResults] = useState(false);

  useEffect(() => {
    const loadedPackages = getState()?.values?.[input.name] || [];
    setChosenOptions(mapPackagesToOptions(loadedPackages));

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

  const handlePackageSearch = async () => {
    if (availableFilter === '') {
      return;
    }

    const { data, meta } = await getPackages(
      getState()?.values?.release || 'rhel-84',
      getState()?.values?.architecture || defaultArch,
      availableFilter
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
    setAvailableOptions(mapPackagesToOptions(removeChosenPackages));

    setHasNoSearchResults(false);
  };

  const handleSearchOnEnter = (e) => {
    if (e.key === 'Enter') {
      e.stopPropagation();
      setEnterPressed(true);
    }
  };

  const moveSelected = (fromAvailable) => {
    const sourceOptions = fromAvailable ? availableOptions : chosenOptions;
    const destinationOptions = fromAvailable ? chosenOptions : availableOptions;
    for (let i = 0; i < sourceOptions.length; i++) {
      const option = sourceOptions[i];
      if (option.selected && option.isVisible) {
        sourceOptions.splice(i, 1);
        destinationOptions.push(option);
        option.selected = false;
        i--;
      }
    }
    if (fromAvailable) {
      setAvailableOptions([...sourceOptions]);
      setChosenOptions([...destinationOptions]);
    } else {
      setChosenOptions([...sourceOptions]);
      setAvailableOptions([...destinationOptions]);
    }
  };

  const moveAll = (fromAvailable) => {
    if (fromAvailable) {
      setChosenOptions([
        ...availableOptions.filter((x) => x.isVisible),
        ...chosenOptions,
      ]);
      setAvailableOptions([...availableOptions.filter((x) => !x.isVisible)]);
    } else {
      setAvailableOptions([
        ...chosenOptions.filter((x) => x.isVisible),
        ...availableOptions,
      ]);
      setChosenOptions([...chosenOptions.filter((x) => !x.isVisible)]);
    }
  };

  const onOptionSelect = (_event, index, isChosen) => {
    if (isChosen) {
      const newChosen = [...chosenOptions];
      newChosen[index].selected = !chosenOptions[index].selected;
      setChosenOptions(newChosen);
    } else {
      const newAvailable = [...availableOptions];
      newAvailable[index].selected = !availableOptions[index].selected;
      setAvailableOptions(newAvailable);
    }
  };

  const buildSearchInput = (isAvailable) => {
    const onChange = (value) => {
      isAvailable ? setAvailableFilter(value) : setChosenFilter(value);
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
            name='textInput1'
            id={`${isAvailable ? 'available' : 'chosen'}-textinput`}
            type='search'
            onChange={onChange}
            placeholder='Search for packages'
            validated={hasMoreResults && isAvailable ? 'warning' : ''}
            aria-label={
              isAvailable ? 'available search input' : 'chosen search input'
            }
          />
          {isAvailable ? (
            <Button
              onClick={handlePackageSearch}
              isDisabled={!isAvailable}
              variant='control'
              aria-label='search button for search input'
            >
              <SearchIcon />
            </Button>
          ) : (
            <InputGroupText>
              <SearchIcon className='pf-u-ml-xs pf-u-mr-xs' />
            </InputGroupText>
          )}
        </InputGroup>
        {hasMoreResults && isAvailable && (
          <HelperText>
            <HelperTextItem variant='warning'>
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

  const buildSort = (isAvailable) => {
    const onSort = () => {
      const toSort = isAvailable ? [...availableOptions] : [...chosenOptions];
      toSort.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });
      if (isAvailable) {
        setAvailableOptions(toSort);
      } else {
        setChosenOptions(toSort);
      }
    };

    return (
      <Button
        variant='plain'
        onClick={onSort}
        aria-label='Sort'
        key='sortButton'
      >
        <PficonSortCommonAscIcon />
      </Button>
    );
  };

  return (
    <DualListSelector>
      <DualListSelectorPane
        title='Available packages'
        status={selectedStatus(availableOptions)}
        searchInput={buildSearchInput(true)}
      >
        <DualListSelectorList style={{ height: '290px' }}>
          {availableOptions.length > 0 ? (
            availableOptions.map((option, index) => {
              return option.isVisible ? (
                <DualListSelectorListItem
                  key={index}
                  isSelected={option.selected}
                  id={`composable-option-${index}`}
                  onOptionSelect={(e) => onOptionSelect(e, index, false)}
                >
                  {option.name}
                </DualListSelectorListItem>
              ) : null;
            })
          ) : hasNoSearchResults ? (
            <NoResultsText
              heading='No Results Found'
              body='Adjust your search and try again'
            />
          ) : (
            <EmptyText text='Search above to add additional packages to your image.' />
          )}
        </DualListSelectorList>
      </DualListSelectorPane>
      <DualListSelectorControlsWrapper aria-label='Selector controls'>
        <DualListSelectorControl
          isDisabled={!availableOptions.some((option) => option.selected)}
          onClick={() => moveSelected(true)}
          aria-label='Add selected'
          tooltipContent='Add selected'
        >
          <AngleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={availableOptions.length === 0}
          onClick={() => moveAll(true)}
          aria-label='Add all'
          tooltipContent='Add all'
        >
          <AngleDoubleRightIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          isDisabled={chosenOptions.length === 0}
          onClick={() => moveAll(false)}
          aria-label='Remove all'
          tooltipContent='Remove all'
        >
          <AngleDoubleLeftIcon />
        </DualListSelectorControl>
        <DualListSelectorControl
          onClick={() => moveSelected(false)}
          isDisabled={!chosenOptions.some((option) => option.selected)}
          aria-label='Remove selected'
          tooltipContent='Remove selected'
        >
          <AngleLeftIcon />
        </DualListSelectorControl>
      </DualListSelectorControlsWrapper>

      {/* Right Selector Pane */}

      <DualListSelectorPane
        title='Chosen packages'
        status={selectedStatus(chosenOptions)}
        searchInput={buildSearchInput(false)}
        isChosen
      >
        <DualListSelectorList>
          {chosenOptions.length === 0 ? (
            <EmptyText text='No packages added.' />
          ) : chosenOptions.filter((option) => option.isVisible).length > 0 ? (
            chosenOptions.map((option, index) => {
              return option.isVisible ? (
                <DualListSelectorListItem
                  key={index}
                  isSelected={option.selected}
                  id={`composable-option-${index}`}
                  onOptionSelect={(e) => onOptionSelect(e, index, true)}
                >
                  {option.name}
                </DualListSelectorListItem>
              ) : null;
            })
          ) : (
            <NoResultsText
              heading='No Results Found'
              body='Adjust your search and try again'
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
