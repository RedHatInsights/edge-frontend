import reducer from './canariesInfo';
import { LOAD_CANARIES_INFO } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_CANARIES_INFO}_PENDING`,
      })
    ).toMatchObject({ isLoading: true, canariesInfo: [] });
  });

  it('should calculate fulfilled - without payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_CANARIES_INFO}_FULFILLED`,
        payload: {},
      })
    ).toMatchObject({ isLoading: false, canariesInfo: [] });
  });

  it('should calculate fulfilled - with payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_CANARIES_INFO}_FULFILLED`,
        payload: {
          results: ['one', 'two'],
        },
      })
    ).toMatchObject({ isLoading: false, canariesInfo: ['one', 'two'] });
  });
});
