import React from 'react';
import InventoriesWidget from './InventoriesWidget';
import { Card } from 'apollo-react-native';
import { useFetcher, useHandleData } from '../../../hooks';
import {
  fetchInventories,
  fetchInventoryTypes,
} from '../../../api/Inventories';
import { normalizeInventories } from './utils';

const InventoriesWidgetContainer = () => {
  const [recordTypes] = useFetcher(fetchInventoryTypes);
  const [inventories] = useFetcher(
    fetchInventories,
    normalizeInventories(recordTypes.data)
  );

  return (
    <Card>
      <Card.Title title="Inventories" />
      <Card.Content>
        {useHandleData(inventories)(data => (
          <InventoriesWidget
            inventories={data.inventories}
            recordTypes={data.recordTypes}
          />
        ))}
      </Card.Content>
    </Card>
  );
};

export default InventoriesWidgetContainer;
