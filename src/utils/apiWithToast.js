import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';

const apiWithToast = (dispatch, api, statusMessages) => {
  const hasSuccess = statusMessages?.onSuccess;

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

      if (hasSuccess) {
        dispatch({
          ...addNotification({
            variant: 'success',
            ...statusMessages.onSuccess,
          }),
        });
      }
      return response;
    } catch (err) {
      dispatch({
        ...addNotification({
          variant: 'danger',
          ...statusMessages.onError,
        }),
      });
      return err;
    }
  };

  return fetchData();
};

export default apiWithToast;
