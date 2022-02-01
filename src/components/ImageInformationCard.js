import React, { useEffect, useState } from 'react';
import LoadingCard from '@redhat-cloud-services/frontend-components-inventory-general-info/LoadingCard';
import { getImageDataOnDevice } from '../api/index';
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
              to={`${paths['manage-images']}/${imageData?.Image?.ImageSetID}`}
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
              to={`${paths['manage-images']}/${imageData?.Image?.ImageSetID}/${imageData?.Image?.ID}`}
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
              to={`${paths['manage-images']}/${imageData?.UpdatesAvailable[0]?.Image?.ImageSetID}/${imageData?.UpdatesAvailable[0]?.Image?.ID}`}
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
          ) : imageData?.Rollback?.ParentId ? (
            <Link to={`${paths['manage-images']}/${imageData?.Rollback?.ID}`}>
              {imageData?.Rollback?.Version}
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
