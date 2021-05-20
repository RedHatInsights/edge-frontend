import reducer from './deviceSummary';
import { LOAD_DEVICE_SUMMARY } from './action-types';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_DEVICE_SUMMARY}_PENDING`,
      })
    ).toMatchObject({ isLoading: true, hasError: false, data: null });
  });

  it('should calculate fulfilled on success', () => {
    const payload = { active: 0, noReports: 0, neverReported: 0, orphaned: 0 };
    expect(
      reducer(undefined, {
        type: `${LOAD_DEVICE_SUMMARY}_FULFILLED`,
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
        type: `${LOAD_DEVICE_SUMMARY}_REJECTED`,
        payload: err,
      })
    ).toMatchObject({
      isLoading: false,
      hasError: true,
      data: 'No device summary data to view',
    });
  });
});
