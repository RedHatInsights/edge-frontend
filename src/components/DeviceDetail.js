import React, { Suspense, lazy } from 'react';
import { useStore, useSelector } from 'react-redux';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';
import TitleWithPopover from './TitleWithPopover';
import GreenbootStatus from './GreenbootStatus';
import AsyncComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
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
    fallback={<CmpLoader numberOfRows={5} />}
    {...props}
  />
);

const OperatingSystemCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./OperatingSystemCard"
    fallback={<CmpLoader numberOfRows={6} />}
    {...props}
  />
);

const BiosCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./BiosCard"
    fallback={<CmpLoader numberOfRows={4} />}
    {...props}
  />
);

const CollectionCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./CollectionCard"
    fallback={<CmpLoader numberOfRows={7} />}
    {...props}
  />
);

const InfrastructureCard = (props) => (
  <AsyncComponent
    appName="inventory"
    module="./InfrastructureCard"
    fallback={<CmpLoader numberOfRows={6} />}
    {...props}
  />
);

const ImageInformationCard = lazy(() => import('./ImageInformationCard'));

const InfrastructureCardWrapper = (props) => {
  const store = useStore();
  return (
    <Suspense fallback="">
      {' '}
      <InfrastructureCard {...props} store={store} />
    </Suspense>
  );
};

const ImageInformationCardWrapper = (props) => {
  const store = useStore();
  return (
    <Suspense fallback="">
      {' '}
      <ImageInformationCard {...props} store={store} />
    </Suspense>
  );
};

const BiosCardWrapper = (props) => {
  const store = useStore();
  return (
    <Suspense fallback="">
      <BiosCard {...props} store={store} />
    </Suspense>
  );
};

const OperatingSystemCardWrapper = (props) => {
  const store = useStore();
  return (
    <Suspense fallback="">
      <OperatingSystemCard {...props} hasKernelModules={true} store={store} />
    </Suspense>
  );
};

const CollectionCardWrapper = (props) => {
  const store = useStore();
  // TODO: fix rhcHealth display
  const rhcHealth = null;
  return (
    <Suspense fallback="">
      <CollectionCard
        {...props}
        extra={[
          {
            title: 'RHC Health (broker functioning)',
            value: rhcHealth || (
              <Tooltip content="Unknown service status">
                <OutlinedQuestionCircleIcon className="ins-c-inventory__detail--unknown" />
              </Tooltip>
            ),
          },
        ]}
        store={store}
      />
    </Suspense>
  );
};

const SystemCardWrapper = (props) => {
  const store = useStore();
  const { greenbootStatus } = useSelector(({ systemProfileStore }) => {
    return {
      greenbootStatus: systemProfileStore?.systemProfile?.greenboot_status,
    };
  });

  return (
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
  );
};

const GeneralInformationTab = () => {
  const writePermissions = useSelector(
    ({ permissionsReducer }) => permissionsReducer?.writePermissions
  );

  const store = useStore();

  return (
    <Suspense fallback="">
      <GeneralInformation
        store={store}
        writePermissions={writePermissions}
        SystemCardWrapper={SystemCardWrapper}
        OperatingSystemCardWrapper={InfrastructureCardWrapper}
        BiosCardWrapper={ImageInformationCardWrapper}
        InfrastructureCardWrapper={BiosCardWrapper}
        ConfigurationCardWrapper={OperatingSystemCardWrapper}
        CollectionCardWrapper={CollectionCardWrapper}
      />
    </Suspense>
  );
};

export default GeneralInformationTab;
