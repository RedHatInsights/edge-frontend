import React, { useContext, useEffect } from 'react';
import { useStore, useSelector } from 'react-redux';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import { useModule } from '@scalprum/react-core';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { RegistryContext } from '../store';

const GeneralInformationTab = () => {
  useEffect(() => {
    insights.chrome.registerModule('inventory');
  }, []);
  const { generalMapper, statusHelper } = useModule(
    'inventory',
    './dataMapper',
    {}
  );
  const { getRegistry } = useContext(RegistryContext);
  const store = useStore();
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

  return generalMapper && statusHelper ? (
    <AsyncComponent
      store={store}
      getRegistry={getRegistry}
      appName="inventory"
      module="./SystemDetail"
      writePermissions={writePermissions}
      ConfigurationCardWrapper={false}
      SystemCardWrapper={(props) => (
        <AsyncComponent
          store={store}
          getRegistry={getRegistry}
          appName="inventory"
          module="./SystemCard"
          {...props}
          hasSAP={false}
        />
      )}
      OperatingSystemCardWrapper={(props) => (
        <AsyncComponent
          store={store}
          getRegistry={getRegistry}
          appName="inventory"
          module="./OperatingSystemCard"
          {...props}
          hasKernelModules={false}
          extra={[
            {
              title: 'Running rpm-ostree version',
              value: runningVersion,
            },
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
      )}
      CollectionCardWrapper={(props) => (
        <AsyncComponent
          store={store}
          getRegistry={getRegistry}
          appName="inventory"
          module="./CollectionCard"
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
      )}
    />
  ) : (
    ''
  );
};

export default GeneralInformationTab;
