import React, { Suspense, lazy } from 'react';
import { useStore, useSelector } from 'react-redux';

const GeneralInformation = lazy(() =>
  import(
    '@redhat-cloud-services/frontend-components-inventory-general-info/GeneralInformation'
  )
);

const SystemCard = lazy(() =>
  import(
    '@redhat-cloud-services/frontend-components-inventory-general-info/SystemCard'
  )
);
const OperatingSystemCard = lazy(() =>
  import(
    '@redhat-cloud-services/frontend-components-inventory-general-info/OperatingSystemCard'
  )
);

const GeneralInformationTab = () => {
  const writePermissions = useSelector(
    ({ permissionsReducer }) => permissionsReducer?.writePermissions
  );

  return (
    <Suspense fallback="">
      <GeneralInformation
        store={useStore()}
        writePermissions={writePermissions}
        ConfigurationCardWrapper={false}
        SystemCardWrapper={(props) => (
          <Suspense fallback="">
            <SystemCard {...props} hasSAP={false} />
          </Suspense>
        )}
        OperatingSystemCardWrapper={(props) => (
          <Suspense fallback="">
            <OperatingSystemCard {...props} hasKernelModules={false} />
          </Suspense>
        )}
      />
    </Suspense>
  );
};

export default GeneralInformationTab;
