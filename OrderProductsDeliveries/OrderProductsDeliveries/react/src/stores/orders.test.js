import { fetchOrderById } from '../api/OrderDetails';
import reducer, {
  setOrderDeliveries,
  setRecordId,
  setRecordType,
  setLoading,
  setSearchProductValue,
  setBrandFilterValue,
  setBrandOptions,
  fetchOrderDetailsAsync,
  setRecordInfoAsync,
} from './orders';
import BridgeEnvData from '../../bridge/EnvironmentData/EnvironmentData.native';

const initialState = {
  orders: [],
  loading: false,
  error: false,
  _recordId: null,
  _recordType: null,
  searchProductValue: null,
  brandOptions: [],
  brandFilter: null
};

jest.mock('../../bridge/EnvironmentData/EnvironmentData.native');
jest.mock('../api/OrderDetails');

test('should return the initial state', () => {
  expect(reducer(undefined, {})).toEqual(initialState);
});

test('should handle order deliveries being added to an empty list', () => {
  const previousState = initialState;
  expect(
    reducer(
      previousState,
      setOrderDeliveries([{ productName: 'Test product name' }])
    )
  ).toEqual({
    orders: [{ productName: 'Test product name' }],
    loading: false,
    error: false,
    _recordId: null,
    _recordType: null,
    searchProductValue: null,
    brandOptions: [],
    brandFilter: null
  });
});

test('should handle order deliveries added to an existing list', () => {
  const previousState = {
    orders: [{ productName: 'Test product name' }],
    loading: false,
    error: false,
    _recordId: null,
    _recordType: null,
    searchProductValue: null,
    brandOptions: [],
    brandFilter: null
  };
  expect(
    reducer(
      previousState,
      setOrderDeliveries([{ productName: 'New product name' }])
    )
  ).toEqual({
    orders: [{ productName: 'New product name' }],
    loading: false,
    error: false,
    _recordId: null,
    _recordType: null,
    searchProductValue: null,
    brandOptions: [],
    brandFilter: null
  });
});

test('should handle loading change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setLoading(true))).toEqual({
    orders: [],
    loading: true,
    error: false,
    _recordId: null,
    _recordType: null,
    searchProductValue: null,
    brandOptions: [],
    brandFilter: null
  });
});

test('should handle record id change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setRecordId('111'))).toEqual({
    orders: [],
    loading: false,
    error: false,
    _recordId: '111',
    _recordType: null,
    searchProductValue: null,
    brandOptions: [],
    brandFilter: null
  });
});

test('should handle record type change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setRecordType('Order'))).toEqual({
    orders: [],
    loading: false,
    error: false,
    _recordId: null,
    _recordType: 'Order',
    searchProductValue: null,
    brandOptions: [],
    brandFilter: null
  });
});

test('should handle searchProductValue change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setSearchProductValue('Product'))).toEqual({
    orders: [],
    loading: false,
    error: false,
    _recordId: null,
    _recordType: null,
    searchProductValue: 'Product',
    brandOptions: [],
    brandFilter: null
  });
});

test('should handle brandFilter change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setBrandFilterValue('Brand'))).toEqual({
    orders: [],
    loading: false,
    error: false,
    _recordId: null,
    _recordType: null,
    searchProductValue: null,
    brandOptions: [],
    brandFilter: 'Brand'
  });
});

test('should handle brandOptions change', () => {
  const previousState = initialState;
  expect(reducer(previousState, setBrandOptions([1,2]))).toEqual({
    orders: [],
    loading: false,
    error: false,
    _recordId: null,
    _recordType: null,
    searchProductValue: null,
    brandOptions: [1,2],
    brandFilter: null
  });
});