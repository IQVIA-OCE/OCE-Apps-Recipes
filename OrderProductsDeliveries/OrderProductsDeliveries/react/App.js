/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useEffect } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from './src/components/Header/Header';
import OrdersTable from './src/components/OrdersTable/OrdersTable';
import {
  fetchOrderDetailsAsync,
  setRecordId,
} from './src/stores/orders';
import { useDispatch, useSelector } from 'react-redux';
import useDebounce from './src/utils/useDebounce';
import { Banner } from 'apollo-react-native';
import { fetchOrderById } from './src/api/OrderDetails';
import { environment } from 'oce-apps-bridges';

Icon.loadFont();

const NAMESPACE = environment.namespace();

const App = ({ recordId }) => {
  const dispatch = useDispatch();
  const { _recordId, searchProductValue, brandFilter } = useSelector(
    (state) => state.ordersListReducers
  );
  const notification = useSelector(state => state.notification);

  const debouncedSearchProductValue = useDebounce(searchProductValue, 500);

  const configureRecordId = async (id) => {
    try {
      const order = await fetchOrderById(id);
      if (order.totalSize > 0) {
        dispatch(setRecordId(order.records[0][`${NAMESPACE}Account__c`]))
      } else {
        dispatch(setRecordId(id))
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (recordId) {
      configureRecordId(recordId);
    }
  }, [recordId]);

  useEffect(() => {
    if (_recordId) dispatch(fetchOrderDetailsAsync(_recordId));
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
      <Header recordId={recordId}/>
      <OrdersTable />
    </>
  );
};

export default App;
