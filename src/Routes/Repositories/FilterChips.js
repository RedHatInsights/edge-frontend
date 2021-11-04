import React, { useEffect, useState } from 'react';
import { ChipGroup, Chip, Button } from '@patternfly/react-core';
import { groupBy } from 'lodash';

const FilterChips = ({ filterValues, setFilterValues }) => {
  const [chipsArray, setChipsArray] = useState([]);

  const buildChipsArray = () => {
    filterValues.forEach((filter) => {
      if (filter.type === 'checkbox') {
        filter.value.forEach((filterOption) => {
          if (
            filterOption.isChecked === true &&
            !chipsArray.find((chip) => chip.label === filterOption.option)
          ) {
            setChipsArray((prevState) => [
              ...prevState,
              { label: filterOption.option, key: filter.label },
            ]);
          }
        });
      }
      if (filter.type === 'text' && filter.value.length > 0) {
        const addTextFilter = { label: filter.value, key: filter.label };
        if (chipsArray.find((chip) => chip.key === filter.label)) {
          setChipsArray((prevState) =>
            prevState.map((f) => {
              return f.key === filter.label ? addTextFilter : f;
            })
          );
        } else {
          setChipsArray((prevState) => [...prevState, addTextFilter]);
        }
      } else if (
        filter.type === 'text' &&
        chipsArray.find((chip) => chip.key === filter.label)
      ) {
        setChipsArray((prevState) => {
          const index = prevState.findIndex(
            (state) => state.key === filter.label
          );
          return [
            ...prevState.slice(0, index),
            ...prevState.slice(index + 1, prevState.length),
          ];
        });
      }
    });
  };

  useEffect(() => {
    buildChipsArray();
  }, [filterValues]);

  const handleResetFilters = () => {
    setFilterValues((prevState) => {
      const removedValues = prevState.map((filter) => {
        if (filter.type === 'text') {
          return { ...filter, value: '' };
        }
        if (filter.type === 'checkbox') {
          const setFalse = filter.value.map((checkbox) => {
            checkbox.isChecked = false;
            return { ...checkbox, isChecked: false };
          });
          return { ...filter, value: setFalse };
        }
      });
      return removedValues;
    });
    setChipsArray([]);
  };

  const handleDeleteFilter = (filter) => {
    const filterLabelIndex = filterValues.findIndex(
      (value) => value.label === filter.key
    );
    setFilterValues((prevState) => {
      const changedValue = prevState[filterLabelIndex];
      if (changedValue.type === 'text') {
        return [
          ...prevState.slice(0, filterLabelIndex),
          { ...prevState[filterLabelIndex], value: '' },
          ...prevState.slice(filterLabelIndex + 1, prevState.length),
        ];
      }
      if (changedValue.type === 'checkbox') {
        const changeFalse = changedValue.value.map((option) =>
          option.option === filter.label
            ? { ...option, isChecked: false }
            : option
        );
        setChipsArray((prevState) => {
          const removeIndex = prevState.findIndex((state) => state === filter);
          return [
            ...prevState.slice(0, removeIndex),
            ...prevState.slice(removeIndex + 1, prevState.length),
          ];
        });
        return [
          ...prevState.slice(0, filterLabelIndex),
          { ...prevState[filterLabelIndex], value: changeFalse },
          ...prevState.slice(filterLabelIndex + 1, prevState.length),
        ];
      }
      return prevState;
    });
  };

  return (
    <>
      {chipsArray.length > 0
        ? Object.entries(groupBy(chipsArray, 'key')).map(([key, value]) => (
            <ChipGroup className="pf-u-mr-xs" categoryName={key}>
              {value.map((filter) => (
                <Chip onClick={() => handleDeleteFilter(filter)}>
                  {filter.label}
                </Chip>
              ))}
            </ChipGroup>
          ))
        : null}
      {chipsArray.length > 0 ? (
        <Button variant="link" onClick={handleResetFilters}>
          Clear filters
        </Button>
      ) : null}
    </>
  );
};

export default FilterChips;
