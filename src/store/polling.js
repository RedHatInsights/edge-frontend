const POLLING_SUFFIX = 'POLLING';

const hasPollingData = (polling = {}) => {
  return (
    polling?.id &&
    polling?.fetcher &&
    polling?.condition &&
    polling?.notifications
  );
};

const ofPollingType = (type) => {
  return type.endsWith(`_${POLLING_SUFFIX}`);
};

export const polling = (pollHash = {}) => ({ dispatch }) => (next) => (
  action
) => {
  const { type, payload, meta } = action;
  if (ofPollingType(type) && hasPollingData(payload)) {
    const { id, fetcher, condition, notifications } = payload;
    if (pollHash[id]) {
      return;
    }
    pollHash[id] = true;
    setTimeout(() => {
      dispatch({
        type: `FETCH_${id}`,
        payload: fetcher().then((resp) => {
          pollHash[id] = false;
          const [toContinue, stateNotification] = condition(resp);
          const notificationPayload = notifications?.[stateNotification];
          if (notificationPayload) {
            dispatch(notificationPayload);
          }
          if (toContinue) {
            dispatch(action);
          }
        }),
      }).catch(() => null);
    }, 15 * 1000);
    return;
  }

  if (hasPollingData(meta?.polling)) {
    const { id, fetcher, condition, notifications } = meta.polling;
    dispatch({
      type: `${id}_POLLING`,
      payload: {
        id,
        fetcher,
        condition,
        notifications,
      },
    });
  }

  next(action);
};
