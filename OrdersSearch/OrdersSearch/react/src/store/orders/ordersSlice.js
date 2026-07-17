import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAccount, fetchAllOrders } from "../../api/ordersApi";
import { LOADING_STATUS } from "../../utils/constants";

export const initialState = {
  ordersList: {
    list: [],
    loadingStatus: LOADING_STATUS.IDLE,
  },
  account: {
    name: null,
    id: null,
    loadingStatus: LOADING_STATUS.IDLE,
  },
  pageType: null,
  error: null 
};

//0016t00000U7Df6AAF  --- account

//a3s6t000000KzqzAAC  - order

export const fetchOrdersList = createAsyncThunk(
  "orders/fetchOrdersList",
  async (id, { getState, rejectWithValue }) => {
    try {
      const { filters, orders } = getState();
      const records = await fetchAllOrders(filters.values, id || orders.account.id);

      return records;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAccountName = createAsyncThunk(
  "orders/fetchAccountName",
  async (recordId, { getState, rejectWithValue }) => {
    try {
      const { records } = await fetchAccount(recordId);
      return records[0].Name;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setAccountId: (state, { payload }) => {
      state.account.id = payload;
    },
    setAccountName: (state, { payload }) => {
      state.account.name = payload;
    },
    setPageType: (state, { payload }) => {
        state.pageType = payload;
    },
    setError: (state, { payload }) => {
      state.error = payload;
    }
  },
  extraReducers: {
    [fetchOrdersList.fulfilled]: (state, action) => {
      state.ordersList.loadingStatus = LOADING_STATUS.SUCCESS;
      state.ordersList.list = action.payload;
    },
    [fetchOrdersList.pending]: (state) => {
      state.ordersList.loadingStatus = LOADING_STATUS.PENDING;
      state.error = null;
    },
    [fetchOrdersList.rejected]: (state, action) => {
      state.ordersList.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.payload;
    },
    [fetchAccountName.fulfilled]: (state, action) => {
      state.account.loadingStatus = LOADING_STATUS.SUCCESS;
      state.account.name = action.payload;
    },
    [fetchAccountName.pending]: (state) => {
      state.account.loadingStatus = LOADING_STATUS.PENDING;
      state.error = null;
    },
    [fetchAccountName.rejected]: (state, action) => {
      state.account.loadingStatus = LOADING_STATUS.FAILED;
      state.error = action.payload;
    },
  },
});

export const ordersSliceReducer = ordersSlice.reducer;

export const { setAccountId, setAccountName, setPageType, setError } = ordersSlice.actions;
