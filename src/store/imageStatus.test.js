import reducer from './imageStatus';
import { LOAD_IMAGE_STATUS } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_IMAGE_STATUS}_PENDING`,
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
        type: `${LOAD_IMAGE_STATUS}_FULFILLED`,
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
        type: `${LOAD_IMAGE_STATUS}_REJECTED`,
        payload: err,
      })
    ).toMatchObject({
      isLoading: false,
      hasError: true,
      data: 'No image status to view',
    });
  });
});
