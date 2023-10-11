import React from 'react';
import DeviceTable from './DeviceTable';
import useApi from '../../hooks/useApi';
import { getInventory } from '../../api/devices';

const DevicesView = (props) => {
  const [response, fetchDevices] = useApi({
    api: getInventory,
    tableReload: true,
  });
  const { data, isLoading, hasError } = response;

  return (
    <DeviceTable
      isLoading={isLoading}
      hasError={hasError}
      count={data?.count}
      data={data?.data?.devices || []}
      fetchDevices={fetchDevices}
      {...props}
    />
  );
};

export default DevicesView;
