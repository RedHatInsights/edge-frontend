import React, { useEffect, useContext } from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import DeviceSummaryTile from './DeviceSummaryTile';
import { imagesReducer, deviceSummaryReducer } from '../store/reducers';
import { useDispatch } from 'react-redux';
import { loadImages, loadDeviceSummary } from '../store/actions';
import { RegistryContext } from '../store';
import PropTypes from 'prop-types';

export const Tiles = () => {
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
  useEffect(() => {
    const registered = getRegistry().register({
      imagesReducer,
      deviceSummaryReducer,
    });
    loadImages(dispatch);
    loadDeviceSummary(dispatch);
    return () => registered();
  }, [dispatch]);
  return (
    <Flex className="tiles">
      <FlexItem>
        <DeviceSummaryTile />
      </FlexItem>
    </Flex>
  );
};

Tiles.propTypes = {
  onNewImageClick: PropTypes.func,
};
