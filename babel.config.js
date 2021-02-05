require.extensions['.css'] = () => undefined;
const path = require('path');
const glob = require('glob');

const cammelToDash = (name) =>
  name
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();

// Mapper for Patternly components
const mapper = {
  TextVariants: 'Text',
  DropdownPosition: 'dropdownConstants',
  EmptyStateVariant: 'EmptyState',
  TextListItemVariants: 'TextListItem',
  TextListVariants: 'TextList',
};

// Wrapper for Patternfly icons
const iconMapper = {};

// Mapper for cloud-services components
const FECMapper = {
  SkeletonSize: 'Skeleton',
  PageHeaderTitle: 'PageHeader',
};

const NotificationMapper = {
  REMOVE_NOTIFICATION: 'actionTypes',
  ADD_NOTIFICATION: 'actionTypes',
  NotificationsPortal: 'NotificationPortal',
  addNotification: 'actions',
};

const CharMapper = {
  ChartThemeColor: 'ChartTheme',
};

module.exports = {
  presets: ['@babel/env', '@babel/react'],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    'lodash',
    [
      'transform-imports',
      {
        '@patternfly/react-core': {
          transform: (importName) => {
            const files = glob.sync(
              path.resolve(
                __dirname,
                `./node_modules/@patternfly/react-core/dist/esm/**/${
                  mapper[importName] || importName
                }.js`
              )
            );
            if (files.length > 0) {
              return files[0].replace(/.*(?=@patternfly)/, '');
            } else {
              throw `File with importName ${importName} does not exist`;
            }
          },
          preventFullImport: false,
          skipDefaultConversion: true,
        },
        '@patternfly/react-icons': {
          transform: (importName) =>
            `@patternfly/react-icons/dist/esm/icons/${cammelToDash(
              importName
            )}.js`,
          preventFullImport: true,
        },
        '@patternfly/react-charts': {
          transform: (importName) =>
            `@patternfly/react-charts/dist/esm/components/${
              CharMapper[importName] || importName
            }/index.js`,
          preventFullImport: true,
          skipDefaultConversion: true,
        },
        '@data-driven-forms/react-form-renderer': {
          transform: (importName) =>
            `@data-driven-forms/react-form-renderer/dist/esm/${cammelToDash(
              importName
            )}.js`,
        },
        '@data-driven-forms/pf4-component-mapper': {
          transform: (importName) =>
            `@data-driven-forms/pf4-component-mapper/dist/esm/${cammelToDash(
              importName
            )}.js`,
        },
      },
    ],
  ],
};
