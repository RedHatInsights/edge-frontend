import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useApi = (api) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const data = await api();
      setData(data);

      dispatch({
        ...addNotification({
          variant: 'success',
          title: 'Success',
          description: 'The request has been made successfully',
        }),
      });
    } catch (err) {
      setHasError(true);

      dispatch({
        ...addNotification({
          variant: 'danger',
          title: 'Error',
          description: 'An error occurred requesting data',
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
