import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const apiWithToast = (dispatch, api, statusMessages, notificationProp) => {
  const hasSuccess = statusMessages?.onSuccess;
  const hasInfo = statusMessages?.onInfo;

  if (!statusMessages) {
    statusMessages = {
      onSuccess: {
        title: 'Success',
        description: 'The request has been made successfully',
      },
      onError: {
        title: 'Error',
        description: 'An error occurred making the request',
      },
    };
  }

  const fetchData = async () => {
    try {
      const response = await api();
      if (hasInfo) {
        if (notificationProp) {
          notificationProp.hasInfo(statusMessages.onInfo);
        } else {
          dispatch({
            ...addNotification({
              variant: 'info',
              ...statusMessages.onInfo,
            }),
          });
        }
      }
      if (hasSuccess) {
        if (notificationProp) {
          notificationProp.hasSuccess(statusMessages.onSuccess);
        } else {
          dispatch({
            ...addNotification({
              variant: 'success',
              ...statusMessages.onSuccess,
            }),
          });
        }
      }
      return response;
    } catch (err) {
      if (notificationProp) {
        notificationProp.err(statusMessages.onError, err);
      } else {
        dispatch({
          ...addNotification({
            variant: 'danger',
            ...statusMessages.onError,
            // Add error message from API, if present
            description: err?.Title
              ? `${statusMessages.onError.description}: ${err.Title}`
              : statusMessages.onError.description,
          }),
        });
      }
      return err;
    }
  };

  return fetchData();
};

export default apiWithToast;
