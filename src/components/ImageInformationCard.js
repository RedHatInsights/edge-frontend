import React, { useEffect, useState } from 'react';
import LoadingCard from '@redhat-cloud-services/frontend-components-inventory-general-info/LoadingCard';
import { getImageDataOnDevice } from '../api/index';
import { routes as paths } from '../../package.json';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ImageInformationCard = () => {
  const deviceId = useSelector(
    ({ entityDetails }) => entityDetails?.entity?.id
  );

  const [imageData, setImageData] = useState(null);
  useEffect(() => {
    (async () => {
      const data = await getImageDataOnDevice(deviceId);
      setImageData(data);
    })();
  }, []);

  return (
    <LoadingCard
      title="Image Information"
      isLoading={false}
      items={[
        {
          title: 'Running image',
          value: (
            <Link to={`${paths['manage-images']}/${imageData?.Image?.ID}`}>
              {imageData?.Image?.Name}
            </Link>
          ),
        },
        {
          title: 'Running version',
          value: (
            <Link to={`${paths['manage-images']}/${imageData?.Image?.ID}`}>
              {imageData?.Image?.Version}
            </Link>
          ),
        },
        {
          title: 'Target version',
          value: imageData?.UpdateAvailable ? (
            <Link
              to={`${paths['manage-images']}/${imageData?.UpdateAvailable?.ID}`}
            >
              {imageData?.UpdateAvailable?.Version}
            </Link>
          ) : (
            'Same as running'
          ),
        },
        {
          title: 'Rollback version',
          value: imageData?.Rollback.ParentId ? (
            <Link to={`${paths['manage-images']}/${imageData?.Rollback?.ID}`}>
              {imageData?.Rollback?.Version}
            </Link>
          ) : (
            'None'
          ),
        },
      ]}
    />
  );
};

export default ImageInformationCard;
