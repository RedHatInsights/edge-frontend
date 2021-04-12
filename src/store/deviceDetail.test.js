import { deviceDetail } from './deviceDetail';
const LOAD_ENTITY_FULFILLED = 'LOAD_ENTITY_FULFILLED'; // inventory defined

describe('reducer', () => {
  it('should calculate detail', () => {
    expect(
      deviceDetail(undefined, {
        type: LOAD_ENTITY_FULFILLED,
      })
    ).toMatchObject({
      loaded: true,
      activeApps: [
        {
          title: 'General information',
          name: 'general_information',
        },
      ],
    });
  });
});
