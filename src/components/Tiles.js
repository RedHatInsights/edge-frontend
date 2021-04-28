import React, { useEffect, useContext } from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import AvailableImagesTile from './AvailableImagesTile';
import { notificationsReducer } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { imagesReducer } from '../store/reducers';
import { useDispatch } from 'react-redux';
import { loadImages } from '../store/actions';
import { RegistryContext } from '../store';

export const Tiles = () => {
  const { getRegistry } = useContext(RegistryContext);
  const dispatch = useDispatch();
  useEffect(() => {
    const registered = getRegistry().register({
      imagesReducer,
      notifications: notificationsReducer,
    });
    loadImages(dispatch);
    return () => registered();
  }, [dispatch]);
  return (
    <Flex style={{ paddingBottom: '1rem' }}>
      <FlexItem>
        <AvailableImagesTile />
      </FlexItem>
    </Flex>
  );
};
