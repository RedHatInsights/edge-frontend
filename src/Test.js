import React, { useState } from 'react';
import useApi from './hooks/useApi';
import { getInventory } from './api/index';

const Test = () => {
  const { data, isLoading, hasError } = useApi(getInventory);
  console.log(data, isLoading, hasError);

  return <div></div>;
};

export default Test;
