import React from 'react';
import { View } from 'react-native';
import InventoriesListItem from './InventoriesListItem';
const VISIBLE_ITEMS = 4;

const InventoriesList = ({ list }) => {
  return (
    <View>
      {list.map((item, i) => {
        if (i < VISIBLE_ITEMS) {
          return <InventoriesListItem key={item.Id} item={item} />;
        }
      })}
    </View>
  );
};

export default InventoriesList;
