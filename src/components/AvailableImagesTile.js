import React from 'react';
import {
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  Bullseye,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';

const AvailableImageTileBase = ({ children }) => (
  <Card className="tiles-card">
    <CardTitle>Available images</CardTitle>
    {children}
  </Card>
);

AvailableImageTileBase.propTypes = {
  children: PropTypes.children,
};

const AvailableImageTile = () => {
  const { isLoading, hasError, data } = useSelector(
    ({ imagesReducer }) => ({
      isLoading:
        imagesReducer?.isLoading !== undefined
          ? imagesReducer?.isLoading
          : true,
      hasError: imagesReducer?.hasError || false,
      data: imagesReducer?.data || null,
    }),
    shallowEqual
  );

  if (isLoading) {
    return (
      <AvailableImageTileBase>
        <CardBody>
          <Bullseye>
            <Spinner />
          </Bullseye>
        </CardBody>
      </AvailableImageTileBase>
    );
  }
  if (hasError) {
    return (
      <AvailableImageTileBase>
        <CardBody>{data}</CardBody>
        <CardFooter>
          <Button isDisabled variant="primary">
            Create new image
          </Button>
        </CardFooter>
      </AvailableImageTileBase>
    );
  }

  return (
    <AvailableImageTileBase>
      <CardBody>
        <Button variant="link" style={{ paddingLeft: 0 }}>
          {data.meta.count} images
        </Button>
      </CardBody>
      <CardFooter>
        <Button variant="primary">Create new image</Button>
      </CardFooter>
    </AvailableImageTileBase>
  );
};

export default AvailableImageTile;
