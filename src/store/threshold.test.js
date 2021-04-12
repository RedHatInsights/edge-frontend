import reducer from './threshold';
import { LOAD_TRESHOLD } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_TRESHOLD}_PENDING`,
      })
    ).toMatchObject({ isLoading: true, threshold: {} });
  });

  it('should calculate fulfilled - without payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_TRESHOLD}_FULFILLED`,
        payload: {},
      })
    ).toMatchObject({ isLoading: false, threshold: {} });
  });

  it('should calculate fulfilled - with payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_TRESHOLD}_FULFILLED`,
        payload: {
          results: {
            some: 'value',
          },
        },
      })
    ).toMatchObject({
      isLoading: false,
      threshold: {
        some: 'value',
      },
    });
  });
});
