import React, { Fragment, useState, Suspense } from 'react';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { useHistory } from 'react-router-dom';
import DeviceTable from './DeviceTable';
import useApi from '../../hooks/useApi';
import { getInventory } from '../../api';
import { Bullseye, Spinner } from '@patternfly/react-core';

const UpdateDeviceModal = React.lazy(() =>
  import(/* webpackChunkName: "CreateImageWizard" */ './UpdateDeviceModal')
);

const Inventory = () => {
  const [response, fetchData] = useApi(getInventory);
  const { data, isLoading, hasError } = response;
  const [updateModal, setUpdateModal] = useState({
    isOpen: false,
    deviceData: null,
    imageData: null,
  });

  const history = useHistory();

  return (
    <Fragment>
      <PageHeader className="pf-m-light">
        <PageHeaderTitle title="Inventory" />
      </PageHeader>
      <Main className="edge-devices">
        <DeviceTable
          data={data?.data}
          count={data?.count}
          isLoading={isLoading}
          hasError={hasError}
          setUpdateModal={setUpdateModal}
        />
      </Main>
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
            refreshTable={fetchData}
          />
        </Suspense>
      )}
    </Fragment>
  );
};

export default Inventory;
