import { createSlice } from '@reduxjs/toolkit';
import { fetchOrderById, fetchAllOrderDetailsRecords } from '../api/OrderDetails';
import { normalizeOrderDeliveries, extractBrandsOptions } from '../utils/utils';
import { RecordType } from '../constants';
import { Keyboard } from 'react-native';

export const initialState = {
  orders: [],
  loading: false,
  error: false,
  _recordId: null,
  _recordType: null,
  searchProductValue: null,
  brandOptions: [],
  brandFilter: null
};

const slice = createSlice({
  name: 'ordersList',
  initialState,
  reducers: {
    setOrderDeliveries: (state, action) =>
      Object.assign({}, state, {
        orders: action.payload,
      }),
    setRecordId: (state, action) =>
      Object.assign({}, state, {
        _recordId: action.payload,
      }),
    setRecordType: (state, action) =>
      Object.assign({}, state, {
        _recordType: action.payload,
      }),
    setLoading: (state, action) =>
      Object.assign({}, state, {
        loading: action.payload,
      }),
    setSearchProductValue: (state, action) =>
      Object.assign({}, state, {
        searchProductValue: action.payload,
      }),
    setBrandFilterValue: (state, action) =>
      Object.assign({}, state, {
        brandFilter: action.payload,
      }),
    setBrandOptions: (state, action) =>
      Object.assign({}, state, {
        brandOptions: action.payload,
      }),
  },
});

export default slice.reducer;

export const {
  setOrderDeliveries,
  setRecordId,
  setRecordType,
  setSearchProductValue,
  setLoading,
  setBrandOptions,
  setBrandFilterValue
} = slice.actions;

export function fetchOrderDetailsAsync(recordType, recordId) {
  return async function (dispatch, getState) {
    const { ordersListReducers } = getState();
    const { searchProductValue, brandFilter, brandOptions } = ordersListReducers;

    try {
      const days = 30;

      dispatch(setLoading(true));
      const productDetails = await fetchAllOrderDetailsRecords(
        recordId,
        recordType,
        days,
        searchProductValue,
        brandFilter?.value || null
      );
      const orderDeliveriesByProduct = normalizeOrderDeliveries(productDetails);
      if (brandFilter) {
        const isNoneExist = brandOptions.some(el => el.value === 'none');
        dispatch(setBrandOptions(isNoneExist ? brandOptions : [{ label: 'None', value: 'none' }, ...brandOptions]))
      } else {
        const brandsOptions = extractBrandsOptions(orderDeliveriesByProduct);
        dispatch(setBrandOptions(brandsOptions))
      }
      dispatch(setOrderDeliveries(orderDeliveriesByProduct));
      dispatch(setLoading(false));
      Keyboard.dismiss();
    } catch (err) {
      console.log(err);
    }
  };
}

export function setRecordInfoAsync(recordId) {
  return async function (dispatch) {
    try {
      dispatch(setLoading(true));
      const ordersResponse = await fetchOrderById(recordId);
      if (ordersResponse.records.length) {
        dispatch(setRecordType(RecordType.Order));
      } else {
        dispatch(setRecordType(RecordType.Account));
      }
      dispatch(setRecordId(recordId));
      dispatch(setLoading(false));
    } catch (err) {
      console.log(err);
    }
  };
}
