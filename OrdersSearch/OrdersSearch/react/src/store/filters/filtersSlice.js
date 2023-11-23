import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { environment } from "oce-apps-bridges";
import { fetchBrands, fetchParentProductIds } from "../../api/ordersApi";
import {
  fetchDeliveryPickListValues,
  fetchOrderPickListValues,
} from "../../api/picklistStatusApi";
import { countFilledValues, mappingBrands } from "../../utils";

const NAMESPACE = environment.namespace();

export const initialState = {
  values: {
    orderName: "",
    productName: "",
    orderStartDate: "",
    orderEndDate: "",
    deliveryStartDate: "",
    deliveryEndDate: "",
    orderStatus: [
      { label: "Submitted", value: "Submitted" },
      { label: "Approval Required", value: "Approval Required" },
    ],
    deliveryStatus: [],
    brands: [],
  },
  filterCount: 1,
  statusOrderPicklist: [],
  statusDeliveryPicklist: [],
  account: "",
  brandsOptions: [],
  error: null,
};


export const fetchBrandsList = createAsyncThunk(
  "orders/fetchBrandsList",
  async (_, { getState, rejectWithValue }) => {
    try {
      let products = [];
      let brands = [];

      const fetchParentProductsRecursively = async (locator = null) => {
        const { records, done, queryLocator } = await fetchParentProductIds(locator);
        products = [...products, ...records];
        if (!done && queryLocator) {
          await fetchParentProductsRecursively(queryLocator);
        }
      };
      const fetchBrandsRecursively = async (locator = null, products_ids) => {
        const { records, done, queryLocator } = await fetchBrands(products_ids, locator);
        brands = [...brands, ...records];
        if (!done && queryLocator) {
          await fetchBrandsRecursively(queryLocator);
        }
      };

      await fetchParentProductsRecursively();

      const products_ids = products.map(item => item[`${NAMESPACE}ParentBrandProductId__c`]).join("','");
      await fetchBrandsRecursively(null, products_ids);

      return mappingBrands(brands);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOrderPickList = createAsyncThunk(
  "orders/fetchOrderPickList",
  async (_, { getState, rejectWithValue }) => {
    try {
      const records = await fetchOrderPickListValues();
      return records;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchDeliveryPickList = createAsyncThunk(
  "orders/fetchDeliveryPickList",
  async (_, { getState, rejectWithValue }) => {
    try {
      const records = await fetchDeliveryPickListValues();
      return records;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, { payload }) => {
      const { key, value } = payload;
      state.values[key] = value;
      state.filterCount = countFilledValues(state.values);
    },
    setSearchedAccount: (state, { payload }) => {
      state.account = payload;
    },
    clearFilters: (state) => {
      state.values = {
        ...initialState.values,
        orderStatus: [],
      };
      state.filterCount = 0;
    },
    setErrorFilters: (state, { payload }) => {
      state.error = payload;
    },
  },
  extraReducers: {
    [fetchBrandsList.fulfilled]: (state, action) => {
      state.brandsOptions = action.payload;
    },
    [fetchBrandsList.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [fetchOrderPickList.fulfilled]: (state, action) => {
      state.statusOrderPicklist = action.payload;
    },
    [fetchOrderPickList.rejected]: (state, action) => {
      state.error = action.payload;
    },
    [fetchDeliveryPickList.fulfilled]: (state, action) => {
      state.statusDeliveryPicklist = action.payload;
    },
    [fetchDeliveryPickList.rejected]: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const filtersSliceReducer = filtersSlice.reducer;

export const { setFilter, setSearchedAccount, clearFilters, setErrorFilters } =
  filtersSlice.actions;
