import {
  LOAD_ACTIVE_IMAGES,
  LOAD_GROUPS,
  LOAD_CANARIES_INFO,
  LOAD_DEVICES_INFO,
  LOAD_GROUP_DETAIL,
  LOAD_GROUP_DEVICES_INFO,
  LOAD_TRESHOLD,
  ACTION_TYPES,
  SELECT_ENTITY,
  PRE_SELECT_ENTITY,
  CLEAN_ENTITIES,
} from './action-types';

describe('actions types', () => {
  it('should be defined', () => {
    expect(LOAD_ACTIVE_IMAGES).toBeDefined();
    expect(LOAD_GROUPS).toBeDefined();
    expect(LOAD_CANARIES_INFO).toBeDefined();
    expect(LOAD_DEVICES_INFO).toBeDefined();
    expect(LOAD_GROUP_DETAIL).toBeDefined();
    expect(LOAD_GROUP_DEVICES_INFO).toBeDefined();
    expect(LOAD_TRESHOLD).toBeDefined();
    expect(SELECT_ENTITY).toBeDefined();
    expect(PRE_SELECT_ENTITY).toBeDefined();
    expect(CLEAN_ENTITIES).toBeDefined();
  });
});

describe('ACTION_TYPES', () => {
  it('should have _PENDINGs', () => {
    expect(ACTION_TYPES[`${LOAD_ACTIVE_IMAGES}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUPS}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_CANARIES_INFO}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_DEVICES_INFO}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DETAIL}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DEVICES_INFO}_PENDING`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_TRESHOLD}_PENDING`]).toBeDefined();
  });

  it('should have _FULFILLEDs', () => {
    expect(ACTION_TYPES[`${LOAD_ACTIVE_IMAGES}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUPS}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_CANARIES_INFO}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_DEVICES_INFO}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DETAIL}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DEVICES_INFO}_FULFILLED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_TRESHOLD}_FULFILLED`]).toBeDefined();
  });

  it('should have _REJECTEDs', () => {
    expect(ACTION_TYPES[`${LOAD_ACTIVE_IMAGES}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUPS}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_CANARIES_INFO}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_DEVICES_INFO}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DETAIL}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_GROUP_DEVICES_INFO}_REJECTED`]).toBeDefined();
    expect(ACTION_TYPES[`${LOAD_TRESHOLD}_REJECTED`]).toBeDefined();
  });
});
