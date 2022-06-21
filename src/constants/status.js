import { iconMapper, colorMapper } from './index';

export const statusMapper = {
  booting: {
    text: 'Booting',
    Icon: iconMapper.checkCircle,
    color: colorMapper.green,
    labelColor: 'green',
  },
  building: {
    text: 'Image build in progress',
    Icon: iconMapper.inProgress,
    color: colorMapper.blue,
    labelColor: 'blue',
  },
  created: {
    text: 'Image build in progress',
    Icon: iconMapper.inProgress,
    color: colorMapper.blue,
    labelColor: 'blue',
  },
  running: {
    text: 'Running',
    Icon: iconMapper.checkCircle,
    color: colorMapper.green,
    labelColor: 'green',
  },
  success: {
    text: 'Ready',
    Icon: iconMapper.checkCircle,
    color: colorMapper.green,
    labelColor: 'green',
  },
  passed: {
    text: 'Passed',
    Icon: iconMapper.checkCircle,
    color: colorMapper.green,
    labelColor: 'green',
  },
  updateAvailable: {
    text: 'Update available',
    Icon: iconMapper.exclamationTriangle,
    color: colorMapper.yellow,
    labelColor: 'orange',
  },
  updating: {
    text: 'Updating',
    Icon: iconMapper.inProgress,
    color: colorMapper.blue,
    labelColor: 'blue',
  },
  error: {
    text: 'Error',
    Icon: iconMapper.timesCircle,
    color: colorMapper.red,
    labelColor: 'red',
  },
  default: {
    text: 'Unknown',
    Icon: iconMapper.unknown,
  },
  interrupted: {
    text: 'Image build in progress',
    Icon: iconMapper.inProgress,
    color: colorMapper.blue,
    labelColor: 'blue',
  },
};
