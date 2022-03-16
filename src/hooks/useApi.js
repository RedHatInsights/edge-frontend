import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useApi = (api, statusMessages) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
    setIsLoading(true);

    try {
      const data = await api();
      setData(data);

      if (hasSuccess) {
        dispatch({
          ...addNotification({
            variant: 'success',
            ...statusMessages.onSuccess,
          }),
        });
      }
    } catch (err) {
      setHasError(true);

      dispatch({
        ...addNotification({
          variant: 'danger',
          ...statusMessages.onError,
        }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return [{ data, isLoading, hasError }, fetchData];
};

export default useApi;
