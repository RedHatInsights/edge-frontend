import reducer from './edgeImages';
import { LOAD_EDGE_IMAGES } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_EDGE_IMAGES}_PENDING`,
      })
    ).toMatchObject({ isLoading: true, hasError: false, data: null });
  });

  it('should calculate fulfilled on success', () => {
    const payload = {
      meta: {
        count: 0,
      },
      data: [],
    };
    expect(
      reducer(undefined, {
        type: `${LOAD_EDGE_IMAGES}_FULFILLED`,
        payload,
      })
    ).toMatchObject({
      isLoading: false,
      hasError: false,
      data: payload,
    });
  });

  it('should calculate fulfilled on error', () => {
    const err = new Error('Network issue');
    expect(
      reducer(undefined, {
        type: `${LOAD_EDGE_IMAGES}_REJECTED`,
        payload: err,
      })
    ).toMatchObject({
      isLoading: false,
      hasError: true,
      data: err,
    });
  });
});
