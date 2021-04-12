import reducer, { systemsList } from './groupsDetail';
import { LOAD_GROUP_DETAIL, CLEAN_ENTITIES } from './action-types';
import { render } from '@testing-library/react';

describe('reducer', () => {
  it('should calculate pending', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUP_DETAIL}_PENDING`,
      })
    ).toMatchObject({ isLoading: true });
  });

  it('should calculate fulfilled - without payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUP_DETAIL}_FULFILLED`,
        payload: {},
      })
    ).toMatchObject({
      isLoading: false,
      name: '',
      uuid: '',
      devices: [],
      meta: {},
    });
  });

  it('should calculate fulfilled - with payload', () => {
    expect(
      reducer(undefined, {
        type: `${LOAD_GROUP_DETAIL}_FULFILLED`,
        payload: {
          name: 'some name',
          uuid: 'something',
          results: ['one', 'two'],
          meta: {
            some: 'value',
          },
        },
      })
    ).toMatchObject({
      isLoading: false,
      name: 'some name',
      uuid: 'something',
      devices: ['one', 'two'],
      meta: {
        some: 'value',
      },
    });
  });
});

describe('systemsList', () => {
  it('should change columns - without defaults', () => {
    expect(
      systemsList({ LOAD_ENTITIES_FULFILLED: 'test_action' })(undefined, {
        type: 'test_action',
      })
    ).toMatchObject({
      columns: [
        { key: 'version', title: 'Version' },
        {
          key: 'status',
          title: 'Status',
        },
      ],
      loaded: true,
    });
  });

  it('should change columns - with defaults', () => {
    expect(
      systemsList({ LOAD_ENTITIES_FULFILLED: 'test_action' })(
        {
          columns: [
            {
              key: 'display_name',
              title: 'Something',
            },
            {
              key: 'updated',
              title: 'Another',
            },
          ],
        },
        {
          type: 'test_action',
        }
      )
    ).toMatchObject({
      columns: [
        {
          key: 'display_name',
          title: 'Something',
        },
        { key: 'version', title: 'Version' },
        {
          key: 'updated',
          title: 'Another',
        },
        {
          key: 'status',
          title: 'Status',
        },
      ],
      loaded: true,
    });
  });

  it('should clean store', () => {
    expect(
      systemsList({})(undefined, {
        type: CLEAN_ENTITIES,
      })
    ).toMatchObject({ loaded: false });
  });

  it('should use component', () => {
    const { columns } = systemsList({ LOAD_ENTITIES_FULFILLED: 'test_action' })(
      undefined,
      {
        type: 'test_action',
      }
    );
    const { container } = render(columns[1].renderFunc('done'));
    expect(container).toMatchSnapshot();
  });
});
