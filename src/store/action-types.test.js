import {
  LOAD_DEVICE_SUMMARY,
  LOAD_ACTIVE_IMAGES,
  LOAD_EDGE_IMAGES,
  LOAD_EDGE_IMAGE_SETS,
  LOAD_GROUPS,
  LOAD_CANARIES_INFO,
  LOAD_DEVICES_INFO,
  LOAD_GROUP_DETAIL,
  LOAD_GROUP_DEVICES_INFO,
  LOAD_IMAGE_STATUS,
  LOAD_IMAGE_DETAIL,
  CREATE_NEW_IMAGE,
  CREATE_NEW_IMAGE_RESET,
  POLLING_IMAGES,
  LOAD_TRESHOLD,
  ACTION_TYPES,
  SELECT_ENTITY,
  PRE_SELECT_ENTITY,
  CLEAN_ENTITIES,
} from './action-types';

describe('actions types', () => {
  it('should be defined', () => {
    expect(LOAD_DEVICE_SUMMARY).toBeDefined();
    expect(LOAD_ACTIVE_IMAGES).toBeDefined();
    expect(LOAD_EDGE_IMAGES).toBeDefined();
    expect(LOAD_EDGE_IMAGE_SETS).toBeDefined();
    expect(LOAD_GROUPS).toBeDefined();
    expect(LOAD_CANARIES_INFO).toBeDefined();
    expect(LOAD_DEVICES_INFO).toBeDefined();
    expect(LOAD_GROUP_DETAIL).toBeDefined();
    expect(LOAD_GROUP_DEVICES_INFO).toBeDefined();
    expect(LOAD_IMAGE_STATUS).toBeDefined();
    expect(LOAD_IMAGE_DETAIL).toBeDefined();
    expect(CREATE_NEW_IMAGE).toBeDefined();
    expect(CREATE_NEW_IMAGE_RESET).toBeDefined();
    expect(POLLING_IMAGES).toBeDefined();
    expect(LOAD_TRESHOLD).toBeDefined();
    expect(SELECT_ENTITY).toBeDefined();
    expect(PRE_SELECT_ENTITY).toBeDefined();
    expect(CLEAN_ENTITIES).toBeDefined();
  });
});

describe('ACTION_TYPES', () => {
  it('should have _PENDINGs', () => {
    expect(ACTION_TYPES[`${LOAD_ACTIVE_IMAGES}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_EDGE_IMAGES}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_EDGE_IMAGE_SETS}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUPS}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_CANARIES_INFO}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_DEVICES_INFO}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DETAIL}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DEVICES_INFO}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_IMAGE_STATUS}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_IMAGE_DETAIL}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${CREATE_NEW_IMAGE}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_TRESHOLD}_PENDING`]).toBeDefined();
  });

  it('should have _FULFILLEDs', () => {
    expect(ACTION_TYPES[`${LOAD_ACTIVE_IMAGES}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_EDGE_IMAGES}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_EDGE_IMAGE_SETS}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUPS}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_CANARIES_INFO}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_DEVICES_INFO}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DETAIL}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DEVICES_INFO}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_IMAGE_STATUS}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_IMAGE_DETAIL}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${CREATE_NEW_IMAGE}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_TRESHOLD}_FULFILLED`]).toBeDefined();
  });

  it('should have _REJECTEDs', () => {
    expect(ACTION_TYPES[`${LOAD_ACTIVE_IMAGES}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_EDGE_IMAGES}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_EDGE_IMAGE_SETS}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUPS}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_CANARIES_INFO}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_DEVICES_INFO}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DETAIL}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DEVICES_INFO}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_IMAGE_STATUS}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_IMAGE_DETAIL}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${CREATE_NEW_IMAGE}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_TRESHOLD}_REJECTED`]).toBeDefined();
  });
});
