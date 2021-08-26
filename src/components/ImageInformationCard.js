import React from 'react';
import LoadingCard from '@redhat-cloud-services/frontend-components-inventory-general-info/LoadingCard';

const ImageInformationCard = () => {
  return (
    <LoadingCard
      title="Image Information"
      isLoading={false}
      items={[
        { title: 'Running image', value: 'this one' },
        { title: 'Running version', value: 'that one' },
        { title: 'Target version', value: 'the one over there' },
        { title: 'Staged version', value: 'not that one' },
        { title: 'Rollback version', value: 'you found it' },
      ]}
    />
  );
};

export default ImageInformationCard;
