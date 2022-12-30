import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrderById,
  fetchAllOrderDetailsRecords,
} from "../api/OrderDetails";
import { normalizeOrderDeliveries, extractBrandsOptions } from "../utils/utils";
import { RecordType } from "../constants";
import { Keyboard } from "react-native";

export const initialState = {
  orders: [],
  loading: false,
  error: false,
  _recordId: null,
  searchProductValue: "",
  brandOptions: [],
  brandFilter: null,
};

const slice = createSlice({
  name: "ordersList",
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
  setSearchProductValue,
  setLoading,
  setBrandOptions,
  setBrandFilterValue,
} = slice.actions;

export function fetchOrderDetailsAsync(recordId) {
  return async function (dispatch, getState) {
    const { ordersListReducers } = getState();
    const { searchProductValue, brandFilter, brandOptions } =
      ordersListReducers;

    try {
      const days = 30;

      dispatch(setLoading(true));
      const productDetails = await fetchAllOrderDetailsRecords(
        recordId,
        days,
        searchProductValue,
        brandFilter?.value || null
      );
      const orderDeliveriesByProduct = normalizeOrderDeliveries(productDetails);
      if (brandFilter) {
        const isNoneExist = brandOptions.some((el) => el.value === "none");
        dispatch(
          setBrandOptions(
            isNoneExist
              ? brandOptions
              : [{ label: "None", value: "none" }, ...brandOptions]
          )
        );
      } else {
        const brandsOptions = extractBrandsOptions(orderDeliveriesByProduct);
        dispatch(setBrandOptions(brandsOptions));
      }
      dispatch(setOrderDeliveries(orderDeliveriesByProduct));
      dispatch(setLoading(false));
      Keyboard.dismiss();
    } catch (err) {
      console.log(err);
    }
  };
}
