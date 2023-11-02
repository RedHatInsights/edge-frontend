import React from 'react';
import DeviceTable from './DeviceTable';
import useApi from '../../hooks/useApi';
import PropTypes from 'prop-types';
import { getInventory, getInventoryByGroup } from '../../api/devices';

const DevicesView = (props) => {
  const [response, fetchDevices] = useApi({
    api: props?.groupUUID ? getInventoryByGroup : getInventory,
    id: props?.groupUUID ? props?.groupUUID.toString() : '',
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
      enforceEdgeGroups={data?.data?.enforce_edge_groups}
      {...props}
    />
  );
};

DevicesView.propTypes = {
  groupUUID: PropTypes.string,
};

export default DevicesView;
