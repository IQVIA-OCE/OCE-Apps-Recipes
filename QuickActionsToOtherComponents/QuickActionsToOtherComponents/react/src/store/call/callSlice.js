import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { metadataBridge, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import * as callApi from '../../api/callApi';
import {
  LOADING_STATUS,
  NAMESPACE,
  SUBMITTED_CALL_STATUS,
  USER_ID,
} from '../../constants';
import {
  callAttendeesMapper,
  callMapperForCall,
  convertInquiry,
  formPickListMapper,
  inquiriesMapper,
  isIOS,
  isWeb,
  ordersMapper,
  storeCheckMapper,
} from '../../utils';

export const initialState = {
  loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
  callObj: null,
  callAttendees: [],
  orders: {
    data: [],
    totalSize: 0,
  },
  inquiries: {
    data: [],
    totalSize: 0,
  },
  storeCheck: {
    data: [],
    totalSize: 0,
  },
  permissions: {
    canCreateOrder: false,
    canCreateInquiry: false,
    canCreateStoreCheck: false,
  },
  inquiryFormData: {
    inquiryTypes: [],
    inquiryChannels: [],
  },
  error: null,
};

export const callBootstrap = createAsyncThunk(
  'callStore/callBootstrap',
  async (recordId, { rejectWithValue }) => {
    try {
      let metadata;
      const {
        records: [call],
      } = await callApi.fetchCall(recordId);
      const { records: callAttendees } = await callApi.fetchCallAttendees(
        call.Id
      );

      if (isWeb) {
        metadata = await sfNetAPI.describe(`${NAMESPACE}Inquiry__c`);
      } else {
        metadata = await metadataBridge.describe(`${NAMESPACE}Inquiry__c`);
      }

      const inquiryTypesList = metadata.fields.find(
        (el) => el.name === `${NAMESPACE}Inquiry_Type__c`
      ).picklistValues;
      const inquiryChannels = metadata.fields.find(
        (el) => el.name === `${NAMESPACE}InquiryChannel__c`
      ).picklistValues;

      return {
        callObj: callMapperForCall(call),
        callAttendees: callAttendeesMapper(callAttendees),
        inquiryFormData: {
          inquiryTypes: formPickListMapper(inquiryTypesList),
          inquiryChannels: formPickListMapper(inquiryChannels),
        },
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'callStore/fetchOrders',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        callStore: { callObj },
      } = getState();
      const { records, totalSize } = await callApi.fetchOrders(callObj.id);

      return {
        data: ordersMapper(records),
        totalSize: totalSize,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchInquiries = createAsyncThunk(
  'callStore/fetchInquiries',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        callStore: { callObj },
      } = getState();
      const { records, totalSize } = await callApi.fetchInquiries(callObj.id);

      return {
        data: inquiriesMapper(records),
        totalSize: totalSize,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchStoreCheck = createAsyncThunk(
  'callStore/fetchStoreCheck',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        callStore: { callObj },
      } = getState();
      const { records, totalSize } = await callApi.fetchStoreCheck(callObj.id);

      return {
        data: storeCheckMapper(records),
        totalSize: totalSize,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const setCallPermissions = createAsyncThunk(
  'callStore/setCallPermissions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        callStore: { callObj },
      } = getState();
      const {
        records: [{ total: isActiveUserOwner }],
      } = await callApi.checkIfUserIsOwnerOfCall(callObj.id, USER_ID);
      const isCallSubmitted = callObj.status === SUBMITTED_CALL_STATUS;

      return {
        canCreateOrder: isActiveUserOwner && !isCallSubmitted,
        canCreateInquiry: isActiveUserOwner && !isCallSubmitted,
        canCreateStoreCheck: isActiveUserOwner && !isCallSubmitted && isIOS,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createNewInquiry = createAsyncThunk(
  'callStore/createNewInquiry',
  async (inquiry, { rejectWithValue }) => {
    try {
      const convertedInquiry = convertInquiry(inquiry);
      const response = await callApi.createNewInquiry(convertedInquiry);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const makeSlice = (_initialState) =>
  createSlice({
    name: 'callStore',
    initialState: _initialState,
    reducers: {},
    extraReducers: {
      [callBootstrap.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.BOOTSTRAPPING;
        state.error = null;
      },
      [callBootstrap.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.callObj = action.payload.callObj;
        state.callAttendees = action.payload.callAttendees;
        state.inquiryFormData = action.payload.inquiryFormData;
      },
      [callBootstrap.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchOrders.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchOrders.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.orders = action.payload;
      },
      [fetchOrders.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchInquiries.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchInquiries.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.inquiries = action.payload;
      },
      [fetchInquiries.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [fetchStoreCheck.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [fetchStoreCheck.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.storeCheck = action.payload;
      },
      [fetchStoreCheck.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [setCallPermissions.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [setCallPermissions.fulfilled]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
        state.permissions = action.payload;
      },
      [setCallPermissions.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
      [createNewInquiry.pending]: (state) => {
        state.loadingStatus = LOADING_STATUS.PENDING;
        state.error = null;
      },
      [createNewInquiry.fulfilled]: (state) => {
        state.loadingStatus = LOADING_STATUS.SUCCESS;
      },
      [createNewInquiry.rejected]: (state, action) => {
        state.loadingStatus = LOADING_STATUS.FAILED;
        state.error = action.error.message;
      },
    },
  });

export const callSlice = makeSlice(initialState);

export const callReducer = callSlice.reducer;
