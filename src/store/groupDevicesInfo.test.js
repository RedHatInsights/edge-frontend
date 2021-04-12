import reducer from './groupDevicesInfo';
import { LOAD_GROUP_DEVICES_INFO } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUP_DEVICES_INFO}_PENDING`,
      })
    ).toMatchObject({ isLoading: true, devicesInfo: {} });
  });

  it('should calculate fulfilled - without payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUP_DEVICES_INFO}_FULFILLED`,
        payload: {},
      })
    ).toMatchObject({ isLoading: false, devicesInfo: {} });
  });

  it('should calculate fulfilled - with payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUP_DEVICES_INFO}_FULFILLED`,
        payload: {
          some: 'value',
        },
      })
    ).toMatchObject({
      isLoading: false,
      devicesInfo: {
        some: 'value',
      },
    });
  });
});
