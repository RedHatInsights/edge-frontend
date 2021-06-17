import reducer from './createImage';
import { CREATE_NEW_IMAGE, CREATE_NEW_IMAGE_RESET } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${CREATE_NEW_IMAGE}_PENDING`,
      })
    ).toMatchObject({ isLoading: true, hasError: false, error: null });
  });

  it('should calculate fulfilled on success', () => {
    expect(
      reducer(undefined, { type: `${CREATE_NEW_IMAGE}_FULFILLED` })
    ).toMatchObject({
      isLoading: false,
      hasError: false,
      error: null,
    });
  });

  it('should calculate fulfilled on error', () => {
    const err = new Error('Network issue');
    expect(
      reducer(undefined, {
        type: `${CREATE_NEW_IMAGE}_REJECTED`,
        payload: err,
      })
    ).toMatchObject({
      isLoading: false,
      hasError: true,
      error: err,
    });
  });

  it('should be reset', () => {
    expect(reducer(undefined, { type: CREATE_NEW_IMAGE_RESET })).toMatchObject({
      isLoading: false,
      hasError: false,
      error: null,
    });
  });
});
