import GeneralInformationTab from '../components/DeviceDetail';

const entityLoaded = (state) => {
  return {
    ...state,
    loaded: true,
    activeApps: [
      {
        title: 'General information',
        name: 'general_information',
        component: GeneralInformationTab,
      },
    ],
  };
};

export const deviceDetail = {
  ['blabla']: entityLoaded,
};
