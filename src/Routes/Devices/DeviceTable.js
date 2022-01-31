import React, { useEffect, useState, useContext, Suspense } from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { cellWidth } from '@patternfly/react-table';
import { Label, Bullseye, Spinner } from '@patternfly/react-core';
import { shallowEqual, useSelector } from 'react-redux';
import { loadDeviceTable } from '../../store/actions';
import { RegistryContext } from '../../store';
import { deviceTableReducer } from '../../store/reducers';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
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
    columnTransforms: [cellWidth(20)],
  },
  {
    title: 'Status',
    type: 'status',
    sort: false,
    columnTransforms: [cellWidth(15)],
  },
];

const DeviceStatus = ({ ImageInfo }) => {
  const statusType = {
    running: (
      <Label
        className='pf-u-mt-sm'
        color='green'
        icon={<CheckCircleIcon color='green' />}
      >
        Running
      </Label>
    ),
    updateAvailable: (
      <Label
        className='pf-u-mt-sm'
        color='orange'
        icon={<ExclamationTriangleIcon />}
      >
        Update Available
      </Label>
    ),
  };

  return ImageInfo?.UpdatesAvailable
    ? statusType['updateAvailable']
    : statusType['running'];
};

const createRows = (devices) => {
  return devices?.map((device) => ({
    id: device?.Device?.UUID,
    display_name: device?.Device?.DeviceName,
    updateImageData: device?.ImageInfo?.UpdatesAvailable?.[0],
    deviceStatus: device?.ImageInfo?.UpdatesAvailable
      ? 'updateAvailable'
      : 'running',
    noApiSortFilter: [
      device?.Device?.DeviceName || '',
      '',
      device?.Device?.UpdatedAt || '',
      device?.ImageInfo?.Image?.Name,
      device?.ImageInfo?.UpdatesAvailable ? 'updateAvailable' : 'running',
    ],
    cells: [
      {
        title: (
          <Link to={`${paths['fleet-management']}/${device?.Device?.UUID}`}>
            {device?.Device?.DeviceName}
          </Link>
        ),
      },
      {
        title: '-',
      },
      {
        title: <DateFormat date={device?.Device?.UpdatedAt} />,
      },
      {
        title: (
          <Link
            to={`${paths['manage-images']}/${device?.ImageInfo?.Image?.ImageSetID}/versions/${device?.ImageInfo?.Image?.ID}/details`}
          >
            {device?.ImageInfo?.Image?.Name}
          </Link>
        ),
      },
      {
        title: (
          <DeviceStatus Device={device?.Device} ImageInfo={device?.ImageInfo} />
        ),
      },
    ],
  }));
};

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
        defaultSort={{ index: 2, direction: 'desc' }}
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
