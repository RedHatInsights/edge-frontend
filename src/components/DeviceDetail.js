import React, { Suspense, lazy } from 'react';
import { useStore, useSelector } from 'react-redux';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import TitleWithPopover from './TitleWithPopover';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';

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

import {
  generalMapper,
  statusHelper,
} from '@redhat-cloud-services/frontend-components-inventory-general-info/dataMapper';

// temp
const data = {
  greenboot_status: 'green',
  rpm_ostree_deployments: [
    {
      id:
        'rhel-edge-7b7ffe8a0a8c54d9625313437a01fa292a866cfa6edf64087879698de7384329.0',
      booted: true,
      origin: 'rhel-edge:rhel/8/x86_64/edge',
      osname: 'rhel-edge',
      pinned: false,
      checksum:
        '7b7ffe8a0a8c54d9625313437a01fa292a866cfa6edf64087879698de7384329',
    },
    {
      id:
        'rhel-edge-7b7ffe8a0a8c54d9625313437a01fa292a866cfa6edf64087879698de7384329.0',
      booted: false,
      origin: 'rhel-edge:rhel/8/x86_64/edge',
      osname: 'rhel-edge',
      pinned: false,
      checksum:
        '7b7ffe8a0a8c54d9625313437a01fa292a866cfa6edf64087879698de7384329',
    },
  ],
};
const GeneralInformationTab = () => {
  const writePermissions = useSelector(
    ({ permissionsReducer }) => permissionsReducer?.writePermissions
  );

  const {
    runningVersion,
    stagedVersion,
    nonActiveVersion,
    heathCheck,
    rhcHealth,
  } = useSelector(({ systemProfileStore }) => ({
    runningVersion:
      //systemProfileStore?.systemProfile?.running_rpm_os_tree_version,
      data.rpm_ostree_deployments.find((deployment) => deployment.booted)
        .checksum,
    stagedVersion:
      systemProfileStore?.systemProfile?.staged_rpm_os_tree_version,
    nonActiveVersion:
      //systemProfileStore?.systemProfile?.non_active_rpm_os_tree_version || [],
      data.rpm_ostree_deployments.filter((deployment) => !deployment.booted),
    heathCheck: data.greenboot_status === 'green' ? 'up' : 'down',
    //systemProfileStore?.systemProfile?.health_check,
    rhcHealth: systemProfileStore?.systemProfile?.rhc_health,
  }));

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
                  value: (
                    <>
                      Last check in:{' '}
                      <DateFormat date={Date.now()} type="relative" />
                    </>
                  ),
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
            {/*<div>Hello</div>*/}
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
