import { createSlice } from "@reduxjs/toolkit";
import { extractBrandsOptions, normalizeOrderDeliveries } from "../utils/utils";
import { Keyboard } from "react-native";
import { fetchAllOrderDetailsRecords } from "../api/OrderDetails";

export const initialState = {
  orders: [],
  loading: false,
  error: false,
  _recordId: null,
  searchProductValue: "",
  brandOptions: [],
  brandFilter: null,
  isAccountFilterVisible: true
};

export const makeOrdersListSlice = (_initialState) => createSlice({
  name: "ordersList",
  initialState: _initialState,
  reducers: {
    setOrderDeliveries: (state, action) => {
        state.orders = action.payload;
    },
    setRecordId: (state, action) => {
        state._recordId = action.payload;
    },
    setLoading: (state, action) => {
        state.loading = action.payload;
    },
    setSearchProductValue: (state, action) => {
        state.searchProductValue = action.payload;
    },
    setBrandFilterValue: (state, action) => {
        state.brandFilter = action.payload;
    },
    setBrandOptions: (state, action) => {
        state.brandOptions = action.payload;
    },
    setAccountFilterVisible: (state, action) => {
      state.isAccountFilterVisible = action.payload;
    }
  },
});

export const ordersListSlice = makeOrdersListSlice(initialState);

export const {
  setOrderDeliveries,
  setRecordId,
  setSearchProductValue,
  setLoading,
  setBrandOptions,
  setBrandFilterValue,
  setAccountFilterVisible
} = ordersListSlice.actions;

export const ordersListReducer = ordersListSlice.reducer;

export function fetchOrderDetailsAsync(recordId) {
  return async function (dispatch, getState) {
    const { orders } = getState();

    const { searchProductValue, brandFilter, brandOptions } = orders;

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
    } catch (err) {
      console.log(err);
    }
  };
}
