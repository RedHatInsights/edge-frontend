import React, { useEffect, useState } from 'react';
import LoadingCard from '@redhat-cloud-services/frontend-components-inventory-general-info/LoadingCard';
import { getImageDataOnDevice } from '../api/images';
import { routes as paths } from '../../package.json';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/Skeleton';

const ImageInformationCard = () => {
  const deviceId = useSelector(
    ({ entityDetails }) => entityDetails?.entity?.id
  );
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

  return (
    <LoadingCard
      title="Image Information"
      isLoading={false}
      items={[
        {
          title: 'Running image',
          value: isImageInfoLoading ? (
            <Skeleton size={SkeletonSize.sm} />
          ) : imageData ? (
            <Link
              to={`${paths['manage-images']}/${imageData?.Image?.ImageSetID}/details`}
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
              to={`${paths['manage-images']}/${imageData?.Image?.ImageSetID}/versions/${imageData?.Image?.ID}/details`}
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
              to={`${paths['manage-images']}/${imageData?.UpdatesAvailable[0]?.Image?.ImageSetID}/versions/${imageData?.UpdatesAvailable[0]?.Image?.ID}/details`}
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
              to={`${paths['manage-images']}/${imageData?.RollbackImage?.ImageSetID}/versions/${imageData?.RollbackImage?.ID}/details`}
            >
              {imageData?.RollbackImage?.Version}
            </Link>
          ) : hasError ? (
            'unavailable'
          ) : (
            'None'
          ),
        },
      ]}
    />
  );
};

export default ImageInformationCard;
