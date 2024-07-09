import {
  ordersListReducer,
  setOrderDeliveries,
  setRecordId,
  setLoading,
  setSearchProductValue,
  setBrandFilterValue,
  setBrandOptions, fetchOrderDetailsAsync,
} from './orders';
import { configureStore } from '@reduxjs/toolkit';
import * as orderDetailsApi from '../api/OrderDetails';

const initialState = {
  orders: [],
  loading: false,
  error: false,
  _recordId: null,
  searchProductValue: "",
  brandOptions: [],
  brandFilter: null,
  isAccountFilterVisible: true
};

const makeStore = (_initialState = {}) => {
  return configureStore({
    reducer: {
      orders: ordersListReducer,
    },
    preloadedState: {
      orders: _initialState,
    },
  });
};

jest.mock('@oce-apps/oce-apps-bridges');
jest.mock('../api/OrderDetails');

test('should return the initial state', () => {
  expect(ordersListReducer(undefined, {})).toEqual(initialState);
});

test('should handle order deliveries being added to an empty list', () => {
  const previousState = initialState;
  expect(
      ordersListReducer(
      previousState,
      setOrderDeliveries([{ productName: 'Test product name' }])
    )
  ).toEqual({
    ...initialState,
    orders: [{ productName: 'Test product name' }]
  });
});

test('should handle order deliveries added to an existing list', () => {
  const previousState = {
    orders: [{ productName: 'Test product name' }],
    loading: false,
    error: false,
    _recordId: null,
    searchProductValue: "",
    brandOptions: [],
    brandFilter: null,
    isAccountFilterVisible: true
  };
  expect(
      ordersListReducer(
      previousState,
      setOrderDeliveries([{ productName: 'New product name' }])
    )
  ).toEqual({
    ...initialState,
    orders: [{ productName: 'New product name' }],
  });
});

test('should handle loading change', () => {
  const previousState = initialState;
  expect(ordersListReducer(previousState, setLoading(true))).toEqual({
    ...initialState,
    loading: true,
  });
});

test('should handle record id change', () => {
  const previousState = initialState;
  expect(ordersListReducer(previousState, setRecordId('111'))).toEqual({
    ...initialState,
    _recordId: '111',
  });
});

test('should handle searchProductValue change', () => {
  const previousState = initialState;
  expect(ordersListReducer(previousState, setSearchProductValue('Product'))).toEqual({
    ...initialState,
    searchProductValue: 'Product',
  });
});

test('should handle brandFilter change', () => {
  const previousState = initialState;
  expect(ordersListReducer(previousState, setBrandFilterValue('Brand'))).toEqual({
    ...initialState,
    brandFilter: 'Brand'
  });
});

test('should handle brandOptions change', () => {
  const previousState = initialState;
  expect(ordersListReducer(previousState, setBrandOptions([1,2]))).toEqual({
    ...initialState,
    brandOptions: [1,2],
  });
});

test('fetchOrderDetailsAsync thunk', async () => {
  const store = makeStore();
  jest.spyOn(orderDetailsApi, 'fetchAllOrderDetailsRecords').mockResolvedValue([
    {
      "Id": "a3v6w000000wVjAAAU",
      "Free__c": 0,
      "Product__r.ParentBrandProductId__r.Name": "B:Alodox CRM1",
      "Quantity__c": 7,
      "ProductName__c": "Alodox 100 MG",
      "Product__c": "a4J6g000000k9CLEAY",
      "OrderDelivery2__c": "a3u6w0000003FRwAAM",
      "Product__r.Name": "Alodox 100 MG",
      "OrderDelivery2__r.DeliveryDate__c": "2023-01-17",
      "Product__r.ParentBrandProductId__c": "a4J6g000000k9AuEAI",
      "OrderLineItem2__c": "a3y6w000000XcPPAA0",
      "Name": "ODTL-6838",
      "Product__r.ProductCode__c": "PRODCODE-B-020-Sample-100MG",
      "Account__c": "0016g00002FSvKoAAL"
    }
  ])

  await store.dispatch(fetchOrderDetailsAsync('1'));

  expect(orderDetailsApi.fetchAllOrderDetailsRecords).toHaveBeenCalled();
})
