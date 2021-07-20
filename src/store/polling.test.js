import configureStore from 'redux-mock-store';
import { createPromise as promiseMiddleware } from 'redux-promise-middleware';
import { polling } from './polling';

describe('Polling Middleware', () => {
  let initialProps;
  let middlewares;
  let mockStore;
  let pollingHash;

  beforeEach(() => {
    initialProps = {};
    pollingHash = {};
    middlewares = [promiseMiddleware(), polling(pollingHash)];
    mockStore = configureStore(middlewares);
    initialProps = {
      store: mockStore({}),
    };
  });

  it('should not dispatch new POLLING action', async () => {
    await initialProps.store.dispatch({
      type: 'FOO',
    });
    expect(pollingHash).toEqual({});
    expect(initialProps.store.getActions()).toEqual([{ type: 'FOO' }]);
  });

  it('should create new entry in polling hash', async () => {
    const foo_action = {
      type: 'FOO',
      meta: {
        polling: {
          id: 'FOO_ITEM_1',
          fetcher: () => Promise.resolve([]),
          condition: () => [false, ''],
          onEvent: {},
        },
      },
    };
    await initialProps.store.dispatch(foo_action);
    expect(pollingHash).toEqual({ FOO_ITEM_1: true });
  });
  it('should set the item to false on done', async () => {
    jest.useFakeTimers();
    const foo_action = {
      type: 'FOO',
      meta: {
        polling: {
          id: 'FOO_ITEM_2',
          fetcher: () => Promise.resolve([]),
          condition: () => [false, ''],
          onEvent: {},
        },
      },
    };
    await initialProps.store.dispatch(foo_action);
    jest.runAllTimers();
    await initialProps.store.getActions();
    expect(pollingHash).toEqual({ FOO_ITEM_2: false });
    jest.useRealTimers();
  });

  it('should not do anything if id is still running', async () => {
    const foo_action = {
      type: 'FOO',
      meta: {
        polling: {
          id: 'FOO_ITEM_3',
          fetcher: () => Promise.resolve([]),
          condition: () => [false, ''],
          onEvent: {},
        },
      },
    };
    await initialProps.store.dispatch(foo_action);
    await initialProps.store.dispatch(foo_action);
    await initialProps.store.getActions();
    expect(pollingHash).toEqual({ FOO_ITEM_3: true });
    expect(initialProps.store.getActions()).toEqual([foo_action, foo_action]);
  });

  it('should not explode on reject', async () => {
    jest.useFakeTimers();
    const foo_action = {
      type: 'FOO',
      meta: {
        polling: {
          id: 'FOO_ITEM_4',
          fetcher: () => Promise.reject(new Error('muhahaha')),
          condition: () => [false, ''],
          onEvent: {},
        },
      },
    };
    await initialProps.store.dispatch(foo_action);
    jest.runAllTimers();
    await initialProps.store.getActions();
    expect(initialProps.store.getActions()).toEqual([
      foo_action,
      { type: 'FOO_ITEM_4_PENDING' },
    ]);
    jest.useRealTimers();
  });

  it('should be able to re-run an action', async () => {
    jest.useFakeTimers();
    let counter = 0;
    const foo_action = {
      type: 'FOO',
      meta: {
        polling: {
          id: 'FOO_ITEM_5',
          fetcher: () => Promise.resolve([]),
          condition: () => {
            counter += 1;
            if (counter === 1) {
              return [true, ''];
            }
            return [false, ''];
          },
          onEvent: {},
        },
      },
    };
    await initialProps.store.dispatch(foo_action);
    jest.runAllTimers();
    await initialProps.store.getActions();
    expect(initialProps.store.getActions()).toEqual([
      foo_action,
      { type: 'FOO_ITEM_5_PENDING' },
    ]);
    jest.runAllTimers();
    expect(initialProps.store.getActions()).toEqual([
      foo_action,
      { type: 'FOO_ITEM_5_PENDING' },
      { type: 'FOO_ITEM_5_PENDING' },
    ]);
    jest.useRealTimers();
  });

  it('should be able to show notification', async () => {
    jest.useFakeTimers();
    const nextAction = {
      type: 'NOTIFICATION',
      payload: {},
    };
    const foo_action = {
      type: 'FOO',
      meta: {
        polling: {
          id: 'FOO_ITEM_6',
          fetcher: () => Promise.resolve([]),
          condition: () => [false, 'build-completed'],
          onEvent: {
            'build-completed': [(dispatch) => dispatch(nextAction)],
          },
        },
      },
    };
    await initialProps.store.dispatch(foo_action);
    jest.runAllTimers();
    await initialProps.store.getActions();
    await initialProps.store.getActions();
    expect(initialProps.store.getActions()).toEqual([
      foo_action,
      { type: 'FOO_ITEM_6_PENDING' },
      nextAction,
      { type: 'FOO_ITEM_6_FULFILLED' },
    ]);
    jest.useRealTimers();
  });
});
