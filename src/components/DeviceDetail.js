import React, { Suspense, lazy } from 'react';
import { useStore, useSelector } from 'react-redux';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import TitleWithPopover from './TitleWithPopover';
import GreenbootStatus from './GreenbootStatus';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { useLoadModule } from '@scalprum/react-core';
import CmpLoader from './CmpLoader';

const GeneralInformation = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./GeneralInformation"
    fallback={<CmpLoader numberOfRows={3} />}
    {...props}
  />
);

const SystemCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./SystemCard"
    fallback={<CmpLoader />}
    {...props}
  />
);

const OperatingSystemCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./OperatingSystemCard"
    fallback={<CmpLoader />}
    {...props}
  />
);

const BiosCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./BiosCard"
    fallback={<CmpLoader />}
    {...props}
  />
);

const CollectionCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./CollectionCard"
    fallback={<CmpLoader />}
    {...props}
  />
);

const InfrastructureCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./InfrastructureCard"
    fallback={<CmpLoader />}
    {...props}
  />
);

const ImageInformationCard = lazy(() => import('./ImageInformationCard'));

const GeneralInformationTab = () => {
  const [{ statusHelper }] = useLoadModule(
    { appName: 'inventory', scope: 'inventory', module: './dataMapper' },
    {}
  );
  const writePermissions = useSelector(
    ({ permissionsReducer }) => permissionsReducer?.writePermissions
  );

  const { greenbootStatus, rhcHealth } = useSelector(
    ({ systemProfileStore }) => ({
      greenbootStatus: systemProfileStore?.systemProfile?.greenboot_status,
      rhcHealth: null,
    })
  );

  const store = useStore();

  return (
    <Suspense fallback="">
      <GeneralInformation
        store={store}
        writePermissions={writePermissions}
        SystemCardWrapper={(props) => (
          <Suspense fallback="">
            <SystemCard
              {...props}
              store={store}
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
            <InfrastructureCard {...props} store={store} />
          </Suspense>
        )}
        BiosCardWrapper={(props) => (
          <Suspense fallback="">
            {' '}
            <ImageInformationCard {...props} store={store} />
          </Suspense>
        )}
        InfrastructureCardWrapper={(props) => (
          <Suspense fallback="">
            <BiosCard {...props} store={store} />
          </Suspense>
        )}
        ConfigurationCardWrapper={(props) => (
          <Suspense fallback="">
            <OperatingSystemCard
              {...props}
              hasKernelModules={true}
              store={store}
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
                  value: statusHelper?.[rhcHealth?.toUpperCase()] || (
                    <Tooltip content="Unknown service status">
                      <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
                    </Tooltip>
                  ),
                },
              ]}
              store={store}
            />
          </Suspense>
        )}
      />
    </Suspense>
  );
};

export default GeneralInformationTab;
