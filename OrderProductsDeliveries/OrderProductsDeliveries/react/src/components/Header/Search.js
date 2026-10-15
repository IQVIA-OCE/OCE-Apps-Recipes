import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Search } from '@oce-apps/apollo-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchProductValue } from '../../stores/orders';
import {searchProductValueSelector} from "../../stores/ordersSelectors";

export default () => {
  const dispatch = useDispatch();
  const searchProductValue = useSelector(searchProductValueSelector);
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
