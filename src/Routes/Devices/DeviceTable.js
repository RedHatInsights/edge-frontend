import React, { useEffect, useState, useContext, Suspense } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { cellWidth } from '@patternfly/react-table';
import { Bullseye, Spinner, Split, SplitItem } from '@patternfly/react-core';
import { shallowEqual, useSelector } from 'react-redux';
import { loadDeviceTable } from '../../store/actions';
import { RegistryContext } from '../../store';
import { deviceTableReducer } from '../../store/reducers';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InProgressIcon,
} from '@patternfly/react-icons';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "CreateImageWizard" */ './UpdateDeviceModal')
);

const defaultFilters = [
  {
    label: 'Name',
    type: 'text',
  },
  {
    label: 'Status',
    type: 'checkbox',
    options: [
      { option: 'Booting', value: 'booting' },
      { option: 'Running', value: 'running' },
      { option: 'Update Available', value: 'updateAvailable' },
      { option: 'Updating', value: 'updating' },
    ],
  },
];

const columnNames = [
  {
    title: 'Name',
    type: 'name',
    sort: true,
    columnTransforms: [cellWidth(30)],
  },
  {
    title: 'Image',
    type: 'image',
    sort: false,
    columnTransforms: [cellWidth(20)],
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
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(25)],
  },
];

const DeviceStatus = ({ Device }) => {
  const status = getDeviceStatus(Device);
  const statusType = {
    booting: (
      <Split className="pf-u-info-color-100">
        <SplitItem className="pf-u-mr-sm">
          <InProgressIcon />
        </SplitItem>
        <SplitItem>Booting</SplitItem>
      </Split>
    ),
    running: (
      <Split className="pf-u-success-color-100">
        <SplitItem className="pf-u-mr-sm">
          <CheckCircleIcon />
        </SplitItem>
        <SplitItem>Running</SplitItem>
      </Split>
    ),
    updateAvailable: (
      <Split className="pf-u-warning-color-100">
        <SplitItem className="pf-u-mr-sm">
          <ExclamationTriangleIcon />
        </SplitItem>
        <SplitItem>Update Available</SplitItem>
      </Split>
    ),
  };

  return statusType[status];
};

const getDeviceStatus = (deviceData) =>
  deviceData?.ImageInfo?.UpdatesAvailable
    ? 'updateAvailable'
    : deviceData?.Device?.Booted
    ? 'running'
    : 'booting';

const createRows = (devices) =>
  devices?.map((device) => ({
    id: device?.Device?.UUID,
    display_name: device?.Device?.DeviceName,
    updateImageData: device?.ImageInfo?.UpdatesAvailable?.[0],
    deviceStatus: getDeviceStatus(device),
    noApiSortFilter: [
      device?.Device?.DeviceName,
      device?.ImageInfo?.Image?.Name || '',
      '',
      device?.Device?.LastSeen,
      getDeviceStatus(device),
    ],
    cells: [
      {
        title: (
          <Link to={`${paths['inventory']}/${device?.Device?.UUID}`}>
            {device?.Device?.DeviceName}
          </Link>
        ),
      },
      {
        title: device?.ImageInfo?.Image?.Name ? (
          <Link
            to={`${paths['manage-images']}/${device?.ImageInfo?.Image?.ImageSetID}/versions/${device?.ImageInfo?.Image?.ID}/details`}
          >
            {device?.ImageInfo?.Image?.Name}
          </Link>
        ) : (
          'unavailable'
        ),
      },
      {
        title: '-',
      },
      {
        title: <DateFormat date={device?.Device?.LastSeen} />,
      },
      {
        title: <DeviceStatus Device={device} />,
      },
    ],
  }));

const DeviceTable = ({ skeletonRowQuantity }) => {
  const { getRegistry } = useContext(RegistryContext);
  const [rows, setRows] = useState([]);
  const [reload, setReload] = useState([]);
  const dispatch = useDispatch();
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });

  const { count, data, isLoading, hasError } = useSelector(
    ({ deviceTableReducer }) => ({
      count: deviceTableReducer?.data?.count || 0,
      data: deviceTableReducer?.data?.data || null,
      isLoading: deviceTableReducer?.isLoading,
      hasError: deviceTableReducer?.hasError,
    }),
    shallowEqual
  );

  useEffect(() => {
    const registered = getRegistry().register({ deviceTableReducer });
    loadDeviceTable(dispatch);
    return () => registered();
  }, [reload]);

  useEffect(() => {
    data && setRows(createRows(data));
  }, [data]);

  const actionResolver = () => {
    return [
      {
        title: 'Update Device',
        onClick: (_event, _rowId, rowData) => {
          setUpdateModal((prevState) => {
            return {
              ...prevState,
              isOpen: true,
              deviceData: {
                id: rowData?.id,
                display_name: rowData?.display_name,
              },
              imageData: rowData?.updateImageData,
            };
          });
        },
      },
    ];
  };

  const areActionsDisabled = (rowData) =>
    rowData?.deviceStatus !== 'updateAvailable';

  return (
    <>
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
        areActionsDisabled={areActionsDisabled}
        defaultSort={{ index: 3, direction: 'desc' }}
        // toolbarButtons={[
        //   {
        //     title: 'Group Selected',
        //     click: () => console.log('Group Selected'),
        //   },
        // ]}
        hasCheckbox={true}
        skeletonRowQuantity={skeletonRowQuantity}
      />
      {updateModal.isOpen && (
        <Suspense
          fallback={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <UpdateDeviceModal
            navigateBack={() => {
              history.push({ pathname: history.location.pathname });
              setUpdateModal((prevState) => {
                return {
                  ...prevState,
                  isOpen: false,
                };
              });
            }}
            setUpdateModal={setUpdateModal}
            updateModal={updateModal}
            refreshTable={() => setReload(true)}
          />
        </Suspense>
      )}
    </>
  );
};
DeviceTable.propTypes = {
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  openUpdateWizard: PropTypes.func,
  skeletonRowQuantity: PropTypes.number,
};

export default DeviceTable;
