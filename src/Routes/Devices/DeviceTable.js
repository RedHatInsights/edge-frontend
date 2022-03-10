import React from 'react';
import GeneralTable from '../../components/general-table/GeneralTable';
import PropTypes from 'prop-types';
import { routes as paths } from '../../../package.json';
import { Link } from 'react-router-dom';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import { cellWidth } from '@patternfly/react-table';
import { Split, SplitItem } from '@patternfly/react-core';
import { loadDeviceTable } from '../../store/actions';
import CustomEmptyState from '../../components/Empty';
import { useHistory } from 'react-router-dom';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InProgressIcon,
} from '@patternfly/react-icons';
import { emptyStateNoFliters } from '../../constants';

const getDeviceStatus = (deviceData) =>
  deviceData?.ImageInfo?.UpdatesAvailable
    ? 'updateAvailable'
    : deviceData?.Device?.Booted
    ? 'running'
    : 'booting';

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

const createRows = (devices) =>
  devices?.map((device) => ({
    deviceID: device?.Device?.ID,
    id: device?.Device?.UUID,
    display_name: device?.Device?.DeviceName,
    updateImageData: device?.ImageInfo?.UpdatesAvailable?.[0],
    deviceStatus: getDeviceStatus(device),
    noApiSortFilter: [
      device?.Device?.DeviceName || '',
      device?.ImageInfo?.Image?.Name || '',
      '',
      device?.Device?.LastSeen || '',
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

const DeviceTable = ({
  hasCheckbox = false,
  setIsModalOpen,
  selectedItems,
  skeletonRowQuantity,
  data,
  count,
  isLoading,
  hasError,
  setUpdateModal,
  handleSingleDeviceRemoval,
  kebabItems,
}) => {
  console.log(data);
  const history = useHistory();

  const actionResolver = (rowData) => {
    // if (!rowData.id) return [];
    const actions = [];

    if (!areActionsDisabled(rowData)) {
      actions.push({
        title: 'Update device',
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
      });
    }

    if (setIsModalOpen) {
      console.log('yup');
      actions.push({
        title: 'Remove device',
        onClick: () => handleSingleDeviceRemoval(2),
      });
    }

    return actions;
  };

  const areActionsDisabled = (rowData) =>
    rowData?.deviceStatus !== 'updateAvailable';

  return (
    <>
      {emptyStateNoFliters(isLoading, count, history) ? (
        <CustomEmptyState
          data-testid="general-table-empty-state-no-data"
          icon={'plus'}
          title={'Connect edge devices'}
          body={
            'Connect and manage edge devices here after registering them via the console. To start, create a RHEL for Edge image and install it to your target device.'
          }
          secondaryActions={[
            {
              title: 'How to connect a device',
              link: '/',
              type: 'link',
            },
          ]}
        />
      ) : (
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
          rows={createRows(data || [])}
          actionResolver={actionResolver}
          areActionsDisabled={setIsModalOpen ? false : areActionsDisabled}
          defaultSort={{ index: 3, direction: 'desc' }}
          toolbarButtons={
            setIsModalOpen
              ? [
                  {
                    title: 'Add systems',
                    click: () => setIsModalOpen(true),
                  },
                ]
              : []
          }
          hasCheckbox={hasCheckbox}
          skeletonRowQuantity={skeletonRowQuantity}
          selectedItems={selectedItems}
          kebabItems={kebabItems}
        />
      )}
    </>
  );
};
DeviceTable.propTypes = {
  imageData: PropTypes.object,
  urlParam: PropTypes.string,
  openUpdateWizard: PropTypes.func,
  skeletonRowQuantity: PropTypes.number,
  // possibly remove some of these
  temp: PropTypes.func,
  hasCheckbox: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  selectedItems: PropTypes.array,
  reload: PropTypes.bool,
  setReload: PropTypes.func,
  data: PropTypes.array,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  setUpdateModal: PropTypes.func,
  handleSingleDeviceRemoval: PropTypes.func,
  kebabItems: PropTypes.array,
};

export default DeviceTable;
