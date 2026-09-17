import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { ToDoItem } from '../ToDoItem/ToDoItem';
import { ToDoListProvider } from './ToDoListProvider';
import { ItemSeparator } from '../ItemSeparator/ItemSeparator';
import { ListEmptyComponent } from '../ListEmptyComponent/ListEmptyComponent';

export const ToDoList = ({
  data,
  isLoading,
  loadMoreTodoData,
  openCompleteForm,
}) => {
  const [openedRow, setOpenedRow] = useState(null);

  const renderItem = ({ item, index }) => (
    <ToDoItem
      item={item}
      index={index}
      onComplete={() => {
        if (openCompleteForm) {
          openCompleteForm(item);
        }
      }}
      openedRow={openedRow}
      setOpenedRow={setOpenedRow}
    />
  );

  return (
    <ToDoListProvider>
      <FlatList
        data={data}
        renderItem={renderItem}
        refreshing={isLoading}
        keyExtractor={(_, index) => index}
        onEndReached={(e) => {
          if (e?.distanceFromEnd < 0) return;
          if (loadMoreTodoData) {
            loadMoreTodoData();
          }
        }}
        onEndReachedThreshold={0.3}
        ItemSeparatorComponent={() => <ItemSeparator />}
        ListEmptyComponent={() =><ListEmptyComponent isLoading={isLoading} />}
        contentContainerStyle={{ flexGrow: 1 }}
        testID={'todoList'}
      />
    </ToDoListProvider>
  );
};
