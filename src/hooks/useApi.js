import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useApi = (api) => {
  const dispatch = useDispatch();
  const [response, setResponse] = useState({
    data: [],
    isLoading: true,
    hasError: false,
  });

  const fetchData = async () => {
    try {
      const data = await api();
      setResponse({
        ...response,
        data,
        isLoading: false,
      });

      dispatch({
        ...addNotification({
          variant: 'success',
          title: 'Success',
          description: 'The request has been made successfully',
        }),
      });
    } catch (err) {
      console.log(err);
      setResponse({
        ...response,
        isLoading: false,
        hasError: true,
      });

      dispatch({
        ...addNotification({
          variant: 'danger',
          title: 'Error',
          description: 'An error occurred requesting data',
        }),
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return response;
};

export default useApi;
