/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from './src/components/Header/Header';
import OrdersTable from './src/components/OrdersTable/OrdersTable';
import {
  fetchOrderDetailsAsync,
  setRecordInfoAsync,
} from './src/stores/orders';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from './src/utils/useDebounce';
import { Banner } from 'apollo-react-native';

Icon.loadFont();

const App = ({ recordId }) => {
  const dispatch = useDispatch();
  const { _recordId, _recordType, searchProductValue, brandFilter } = useSelector(
    (state) => state.ordersListReducers
  );
  const notification = useSelector(state => state.notification);

  const debouncedSearchProductValue = useDebounce(searchProductValue, 500);

  useEffect(() => {
    if (recordId) {
      dispatch(setRecordInfoAsync(recordId));
    }
  }, [recordId]);

  useEffect(() => {
    if (_recordId) dispatch(fetchOrderDetailsAsync(_recordType, _recordId));
  }, [_recordId, debouncedSearchProductValue, brandFilter]);

  return (
    <>
      <Banner
        closeIcon
        visible={notification.visible}
        variant={notification.variant}
        icon={notification.icon}
        onCloseIconPress={() => dispatch(closeNotification())}
      >
        {notification.text}
      </Banner>
      <Header />
      <OrdersTable />
    </>
  );
};

export default App;
