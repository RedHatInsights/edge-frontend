import { entitiesReducer } from './inventory-table';
import { SELECT_ENTITY } from './action-types';

const defaultState = {
  rows: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
};

describe('entitiesReducer', () => {
  describe('SELECT_ENTITY', () => {
    it('should select one item', () => {
      const { selected } = entitiesReducer({})(defaultState, {
        type: SELECT_ENTITY,
        payload: {
          selected: true,
          id: 1,
        },
      });

      expect(selected.get(1)).toBeDefined();
      expect(selected.get(1)).toMatchObject({ id: 1 });
    });

    it('should deselect one item', () => {
      const { selected } = entitiesReducer({})(
        {
          ...defaultState,
          selected: new Map([
            [1, { id: 1 }],
            [2, { id: 2 }],
          ]),
        },
        {
          type: SELECT_ENTITY,
          payload: {
            selected: false,
            id: 1,
          },
        }
      );
      expect(selected.get(1)).not.toBeDefined();
      expect(selected.get(2)).toMatchObject({ id: 2 });
    });

    it('should select page', () => {
      const { selected } = entitiesReducer({})(defaultState, {
        type: SELECT_ENTITY,
        payload: {
          selected: true,
          id: 0,
        },
      });
      expect(selected.size).toBe(defaultState.rows.length);
    });

    it('should deselect page', () => {
      const { selected } = entitiesReducer({})(
        {
          ...defaultState,
          selected: new Map([
            [1, { id: 1 }],
            [2, { id: 2 }],
          ]),
        },
        {
          type: SELECT_ENTITY,
          payload: {
            selected: false,
            id: 0,
          },
        }
      );
      expect(selected.size).toBe(0);
    });

    it('should clear all', () => {
      const { selected } = entitiesReducer({})(
        {
          ...defaultState,
          selected: new Map([
            [1, { id: 1 }],
            [2, { id: 2 }],
          ]),
        },
        {
          type: SELECT_ENTITY,
          payload: {
            selected: false,
            id: -1,
          },
        }
      );
      expect(selected.size).toBe(0);
    });
  });

  describe('LOAD_ENTITIES_FULFILLED', () => {
    it('should set selected on rows', () => {
      const { rows } = entitiesReducer({
        LOAD_ENTITIES_FULFILLED: 'test_action',
      })(
        {
          ...defaultState,
          selected: new Map([
            [1, { id: 1 }],
            [2, { id: 2 }],
          ]),
        },
        {
          type: 'test_action',
        }
      );
      expect(rows[0]).toMatchObject({ id: 1, selected: true });
      expect(rows[1]).toMatchObject({ id: 2, selected: true });
      expect(rows[2]).toMatchObject({ id: 3, selected: false });
      expect(rows[3]).toMatchObject({ id: 4, selected: false });
      expect(rows[4]).toMatchObject({ id: 5, selected: false });
    });
  });
});
