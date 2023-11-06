import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useApi = ({ api, id = null, statusMessages, tableReload = false }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [apiFunc, setAPIFunc] = useState(() => api);

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

  const fetchData = async (query = '') => {
    setIsLoading(true);
    try {
      const data = await apiFunc({ id, query });
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
    if (!tableReload) {
      fetchData();
    }
  }, []);

  return [{ data, isLoading, hasError }, fetchData, apiFunc, setAPIFunc];
};

export default useApi;
