const POLLING_SUFFIX = 'POLLING';

const hasPollingData = (polling = {}) => {
  return polling?.id && polling?.fetcher && polling?.condition;
};

const ofPollingType = (type) => type.endsWith(`_${POLLING_SUFFIX}`);

export const polling = (pollHash = {}) => ({ dispatch }) => (next) => (
  action
) => {
  const { type, payload, meta } = action;
  if (ofPollingType(type) && hasPollingData(payload)) {
    const { id, fetcher, condition, onEvent } = payload;
    if (pollHash[id]) {
      return;
    }
    pollHash[id] = true;
    setTimeout(() => {
      dispatch({
        type: id,
        payload: fetcher().then((resp) => {
          pollHash[id] = false;
          const [toContinue, stateName] = condition(resp);
          const nextActions = onEvent?.[stateName] || [];
          nextActions.forEach((action) => action(dispatch));
          if (toContinue) {
            dispatch(action);
          }
        }),
      }).catch(() => null);
    }, 15 * 1000);
    return;
  }

  if (hasPollingData(meta?.polling)) {
    const { id, fetcher, condition, onEvent } = meta.polling;
    dispatch({
      type: `${id}_POLLING`,
      payload: {
        id,
        fetcher,
        condition,
        onEvent,
      },
    });
  }

  next(action);
};
