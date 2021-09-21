import React, { Suspense, lazy } from 'react';
import { useStore, useSelector } from 'react-redux';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import TitleWithPopover from './TitleWithPopover';
import GreenbootStatus from './GreenbootStatus';

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

const BiosCard = lazy(() =>
  import(
    '@redhat-cloud-services/frontend-components-inventory-general-info/BiosCard'
  )
);

const CollectionCard = lazy(() =>
  import(
    '@redhat-cloud-services/frontend-components-inventory-general-info/CollectionCard'
  )
);

const InfrastructureCard = lazy(() =>
  import(
    '@redhat-cloud-services/frontend-components-inventory-general-info/InfrastructureCard'
  )
);
const ImageInformationCard = lazy(() => import('./ImageInformationCard'));

import { statusHelper } from '@redhat-cloud-services/frontend-components-inventory-general-info/dataMapper';

const GeneralInformationTab = () => {
  const writePermissions = useSelector(
    ({ permissionsReducer }) => permissionsReducer?.writePermissions
  );

  const { greenbootStatus, rhcHealth } = useSelector(
    ({ systemProfileStore }) => ({
      greenbootStatus: systemProfileStore?.systemProfile?.greenboot_status,
      rhcHealth: null,
    })
  );

  return (
    <Suspense fallback="">
      <GeneralInformation
        store={useStore()}
        writePermissions={writePermissions}
        SystemCardWrapper={(props) => (
          <Suspense fallback="">
            <SystemCard
              {...props}
              hasCPUs={false}
              hasSockets={false}
              hasCores={false}
              hasCPUFlags={false}
              hasRAM={false}
              hasSAP={false}
              extra={[
                {
                  title: (
                    <TitleWithPopover
                      title="GreenBoot Status"
                      content="This is a description about greenboot status"
                    />
                  ),
                  value: <GreenbootStatus status={greenbootStatus} />,
                },
              ]}
            />
          </Suspense>
        )}
        OperatingSystemCardWrapper={(props) => (
          <Suspense fallback="">
            {' '}
            <InfrastructureCard {...props} />
          </Suspense>
        )}
        BiosCardWrapper={(props) => (
          <Suspense fallback="">
            {' '}
            <ImageInformationCard {...props} />
          </Suspense>
        )}
        InfrastructureCardWrapper={(props) => (
          <Suspense fallback="">
            <BiosCard {...props} />
          </Suspense>
        )}
        ConfigurationCardWrapper={(props) => (
          <Suspense fallback="">
            <OperatingSystemCard {...props} hasKernelModules={true} />
          </Suspense>
        )}
        CollectionCardWrapper={(props) => (
          <Suspense fallback="">
            <CollectionCard
              {...props}
              extra={[
                {
                  title: 'RHC Health (broker functioning)',
                  value: statusHelper[rhcHealth?.toUpperCase()] || (
                    <Tooltip content="Unknown service status">
                      <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
                    </Tooltip>
                  ),
                },
              ]}
            />
          </Suspense>
        )}
      />
    </Suspense>
  );
};

export default GeneralInformationTab;
