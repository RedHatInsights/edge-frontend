import React, { useEffect, useState, useContext } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { cellWidth } from '@patternfly/react-table';
import { shallowEqual, useSelector } from 'react-redux';
import { loadDeviceTable } from '../../store/actions';
import { RegistryContext } from '../../store';
import { deviceTableReducer } from '../../store/reducers';
import { TagIcon } from '@patternfly/react-icons';

const defaultFilters = [
  {
    label: 'Name',
    type: 'text',
  },
  {
    label: 'Status',
    type: 'checkbox',
    options: [
      { option: 'Building', value: 'BUILDING' },
      { option: 'Created', value: 'CREATED' },
      { option: 'Error', value: 'ERROR' },
      { option: 'Ready', value: 'SUCCESS' },
    ],
  },
];

const columnNames = [
  {
    title: 'Name',
    type: 'name',
    sort: true,
    columnTransforms: [cellWidth(35)],
  },
  {
    title: 'Tags',
    type: 'tags',
    sort: false,
    columnTransforms: [cellWidth(10)],
  },
  {
    title: 'Groups',
    type: 'groups',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Last Seen',
    type: 'last_seen',
    sort: true,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Image',
    type: 'image',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
  {
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
];

const createRows = (devices) => {
  return devices?.map((device) => ({
    id: device.id,
    noApiSortFilter: [device?.display_name, '', '', device?.updated, '', ''],
    cells: [
      {
        title: (
          <Link
            to={`${paths['fleet-management-detail']}/${device?.insights_id}`}
          >
            {device?.display_name}
          </Link>
        ),
      },
      {
        title: (
          <>
            <TagIcon /> -
          </>
        ),
      },
      {
        title: '-',
      },
      {
        title: <DateFormat date={device?.updated} />,
      },
      {
        title: '-',
      },
      {
        title: '-',
      },
    ],
  }));
};

const DeviceTable = () => {
  const { getRegistry } = useContext(RegistryContext);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();

  const { count, data, isLoading, hasError } = useSelector(
    ({ deviceTableReducer }) => ({
      count: deviceTableReducer?.data?.count || 0,
      data: deviceTableReducer?.data?.results || null,
      isLoading: deviceTableReducer?.isLoading,
      hasError: deviceTableReducer?.hasError,
    }),
    shallowEqual
  );

  const UpdateDeviceModal = React.lazy(() =>
    import(
      /* webpackChunkName: "CreateImageWizard" */ '../Devices/UpdateDeviceModal'
    )
  );

  useEffect(() => {
    const registered = getRegistry().register({ deviceTableReducer });
    loadDeviceTable(dispatch);
    return () => registered();
  }, []);

  useEffect(() => {
    data && setRows(createRows(data));
  }, [data]);

  const actionResolver = () => {
    return [
      {
        title: 'Update Device',
        onClick: (_event, _rowId, rowData) => {
          UpdateDeviceModal(rowData.id);
        },
      },
    ];
  };

  //const areActionsDisabled = (rowData) => rowData?.imageStatus === 'BUILDING';

  return (
    <GeneralTable
      apiFilterSort={false}
      filters={defaultFilters}
      loadTableData={loadDeviceTable}
      tableData={{
        count: count,
        isLoading: isLoading,
        hasError: hasError,
      }}
      columnNames={columnNames}
      rows={rows || []}
      actionResolver={actionResolver}
      areActionsDisabled={() => false}
      defaultSort={{ index: 3, direction: 'desc' }}
      toolbarButtons={[
        {
          title: 'Group Selected',
          click: () => console.log('Group Selected'),
        },
      ]}
      hasCheckbox={true}
    />
  );
};
DeviceTable.propTypes = {
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  openUpdateWizard: PropTypes.func,
};

export default DeviceTable;
