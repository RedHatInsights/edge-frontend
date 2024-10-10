import React, { Suspense, useEffect, useState } from 'react';
import { getImageDataOnDevice } from '../api/images';
import { routes as paths } from '../constants/routeMapper';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';
import CmpLoader from './CmpLoader';
import PropTypes from 'prop-types';

const LoadingCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./LoadingCard"
    fallback={<CmpLoader numberOfRows={5} />}
    {...props}
  />
);

const ImageInformationCard = ({ deviceIdProps }) => {
  const deviceId =
    deviceIdProps ??
    useSelector(({ entityDetails }) => entityDetails?.entity?.id);
  const [isImageInfoLoading, setIsImageInfoLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getImageDataOnDevice(deviceId);
        setImageData(data);
      } catch (err) {
        setHasError(true);
      }
      setIsImageInfoLoading(false);
    })();
  }, []);

  const edgeImageData = [
    {
      title: 'Running image',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData ? (
        <Link
          to={`${paths.manageImages}/${imageData?.Image?.ImageSetID}/details`}
        >
          {imageData?.Image?.Name}
        </Link>
      ) : (
        'unavailable'
      ),
    },
    {
      title: 'Running version',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData ? (
        <Link
          to={`${paths.manageImages}/${imageData?.Image?.ImageSetID}/versions/${imageData?.Image?.ID}/details`}
        >
          {imageData?.Image?.Version}
        </Link>
      ) : (
        'unavailable'
      ),
    },
    {
      title: 'Target version',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData?.UpdatesAvailable ? (
        <Link
          to={`${paths.manageImages}/${imageData?.UpdatesAvailable[0]?.Image?.ImageSetID}/versions/${imageData?.UpdatesAvailable[0]?.Image?.ID}/details`}
        >
          {imageData?.UpdatesAvailable[0]?.Image?.Version}
        </Link>
      ) : hasError ? (
        'unavailable'
      ) : (
        'Same as running'
      ),
    },
    {
      title: 'Rollback version',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData?.RollbackImage?.ID ? (
        <Link
          to={`${paths.manageImages}/${imageData?.RollbackImage?.ImageSetID}/versions/${imageData?.RollbackImage?.ID}/details`}
        >
          {imageData?.RollbackImage?.Version}
        </Link>
      ) : hasError ? (
        'unavailable'
      ) : (
        'None'
      ),
    },
  ];

  const federatedImageData = [
    {
      title: 'Running image',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData ? (
        imageData?.Image?.Name
      ) : (
        'unavailable'
      ),
    },
    {
      title: 'Running version',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData ? (
        imageData?.Image?.Version
      ) : (
        'unavailable'
      ),
    },
    {
      title: 'Target version',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData?.UpdatesAvailable ? (
        imageData?.UpdatesAvailable[0]?.Image?.Version
      ) : hasError ? (
        'unavailable'
      ) : (
        'Same as running'
      ),
    },
    {
      title: 'Rollback version',
      value: isImageInfoLoading ? (
        <Skeleton size={SkeletonSize.sm} />
      ) : imageData?.RollbackImage?.ID ? (
        imageData?.RollbackImage?.Version
      ) : hasError ? (
        'unavailable'
      ) : (
        'None'
      ),
    },
  ];

  return (
    <Suspense fallback="">
      <LoadingCard
        title="Image information"
        isLoading={false}
        items={deviceIdProps ? federatedImageData : edgeImageData}
        cardId="image-information"
      />
    </Suspense>
  );
};

ImageInformationCard.propTypes = {
  deviceIdProps: PropTypes.string,
};

export default ImageInformationCard;
