import React from 'react';
import { Platform } from 'react-native';
import { SwipeableItem } from '../SwipeItem/SwipeItem';
import { ToDoItemContent } from './ToDoItemContent';

export const ToDoItem = ({ item, index, onComplete }) => {

  return (
    <SwipeableItem
      itemKey={item.Id}
      key={item.id}
      rightButtons={
        Platform.OS === 'web'
          ? []
          : [
              {
                text: 'Complete',
                onPress: () => onComplete(item),
                key: 'complete',
              },
            ]
      }
    >
      <ToDoItemContent item={item} index={index} onComplete={onComplete}/>
    </SwipeableItem>
  );
};


