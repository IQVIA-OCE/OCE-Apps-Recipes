import { FlatList } from 'react-native';
import { ItemSeparator } from '../ItemSeparator/ItemSeparator';
import { ListEmptyComponent } from '../ListEmptyComponent/ListEmptyComponent';
import { AccountItem } from './AccountItem/AccountItem';

export const AccountsList = ({ selectedAccount, cellWidth, data, isLoading, loadMore, onItemPress }) => {
  const renderItem = ({ item }) => (
    <AccountItem item={item} onPress={onItemPress} selectedAccount={selectedAccount} cellWidth={cellWidth} />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      refreshing={isLoading}
      keyExtractor={(_, index) => index}
      onEndReached={(e) => {
        if (e?.distanceFromEnd < 0) return;
        if (typeof loadMore === 'function') {
          loadMore();
        }
      }}
      onEndReachedThreshold={0.3}
      ItemSeparatorComponent={() => <ItemSeparator />}
      ListEmptyComponent={() => <ListEmptyComponent isLoading={isLoading} />}
      contentContainerStyle={{ flexGrow: 1 }}
      testID={'callTodoList'}
    />
  );
};
