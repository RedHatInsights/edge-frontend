import React, { Suspense, lazy } from 'react';
import { useStore, useSelector } from 'react-redux';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';

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

const CollectionCard = lazy(() =>
  import(
    '@redhat-cloud-services/frontend-components-inventory-general-info/CollectionCard'
  )
);

import {
  generalMapper,
  statusHelper,
} from '@redhat-cloud-services/frontend-components-inventory-general-info/dataMapper';

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
      systemProfileStore?.systemProfile?.running_rpm_os_tree_version,
    stagedVersion:
      systemProfileStore?.systemProfile?.staged_rpm_os_tree_version,
    nonActiveVersion:
      systemProfileStore?.systemProfile?.non_active_rpm_os_tree_version || [],
    heathCheck: systemProfileStore?.systemProfile?.health_check,
    rhcHealth: systemProfileStore?.systemProfile?.rhc_health,
  }));

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
            <OperatingSystemCard
              {...props}
              hasKernelModules={false}
              extra={[
                { title: 'Running rpm-ostree version', value: runningVersion },
                {
                  title: 'Staged rpm-ostree version',
                  value: stagedVersion,
                },
                {
                  title: 'Non-active (available rollback version(s))',
                  value: nonActiveVersion?.length,
                  plural: 'versions',
                  singular: 'version',
                  onClick: (_e, handleClick) =>
                    handleClick(
                      'Non-active (available rollback version(s))',
                      generalMapper(nonActiveVersion || [], 'Version'),
                      'small'
                    ),
                },
                {
                  title: 'Health check status',
                  value: statusHelper[heathCheck?.toUpperCase()] || (
                    <Tooltip content="Unknown service status">
                      <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
                    </Tooltip>
                  ),
                },
              ]}
            />
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
