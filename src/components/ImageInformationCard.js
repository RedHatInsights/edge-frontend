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
            <Link to={`${paths['manage-images']}/${imageData?.ID}`}>
              {imageData?.Name}
            </Link>
          ),
        },
        {
          title: 'Running version',
          value: (
            <Link to={`${paths['manage-images']}/${imageData?.ID}`}>
              {imageData?.Version}
            </Link>
          ),
        },
        {
          title: 'Target version',
          value: imageData?.updateAvailable ? (
            <Link
              to={`${paths['manage-images']}/${imageData?.updateAvailable?.ID}`}
            >
              {imageData?.updateAvailable?.Version}
            </Link>
          ) : (
            'Same as running'
          ),
        },
        {
          title: 'Rollback version',
          value: imageData?.rollback ? (
            <Link to={`${paths['manage-images']}/${imageData?.rollback?.ID}`}>
              {imageData?.rollback?.Version}
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
