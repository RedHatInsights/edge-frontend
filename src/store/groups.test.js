import reducer from './groups';
import { LOAD_GROUPS } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUPS}_PENDING`,
      })
    ).toMatchObject({ isLoading: true, groups: [] });
  });

  it('should calculate fulfilled - without payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUPS}_FULFILLED`,
        payload: {},
      })
    ).toMatchObject({ isLoading: false, groups: [], meta: {} });
  });

  it('should calculate fulfilled - with payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUPS}_FULFILLED`,
        payload: {
          results: ['one', 'two'],
          meta: {
            some: 'value',
          },
        },
      })
    ).toMatchObject({
      isLoading: false,
      groups: ['one', 'two'],
      meta: {
        some: 'value',
      },
    });
  });
});
