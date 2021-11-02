import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Search } from 'apollo-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchProductValue } from '../../stores/orders';

export default () => {
  const dispatch = useDispatch();
  const searchProductValue = useSelector((state) => state.ordersListReducers.searchProductValue);
  return (
    <View style={styles.content}>
      <Search
        testID="search-view"
        placeholder="Search product name"
        value={searchProductValue}
        onChangeText={(text) => dispatch(setSearchProductValue(text))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    width: 300,
  },
});
