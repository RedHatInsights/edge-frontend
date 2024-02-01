import { useState, useEffect } from 'react';
import { useFeatureFlags } from '../utils';
import { FEATURE_PARITY_INVENTORY_GROUPS } from '../constants/features';
import { getEnforceEdgeGroups } from '../api/groups';

const useInventoryGroups = (value) => {
  const [data, setData] = useState(value);
  const [ready, setReady] = useState(false);
  const inventoryGroupsEnabled = useFeatureFlags(
    FEATURE_PARITY_INVENTORY_GROUPS
  );

  useEffect(() => {
    (async () => {
      const response = await getEnforceEdgeGroups();
      const enforceEdgeGroups = response?.enforce_edge_groups;
      setData(!enforceEdgeGroups && inventoryGroupsEnabled);
      setReady(true);
    })();
  }, []);

  return [data, ready];
};

export default useInventoryGroups;
