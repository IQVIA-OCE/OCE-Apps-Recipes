import { configureStore } from '@reduxjs/toolkit';
import { metadataBridge, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import * as callApi from '../../api/callApi';
import {
  CALL_ATTENDEES_MAPPED_DATA,
  CALL_ATTENDEES_ORIG_DATA,
  CALL_MAPPED_DATA,
  CALL_ORIG_DATA,
  INQUIRIES_MAPPED_DATA,
  INQUIRIES_ORIG_DATA,
  INQUIRY_CHANNEL_MAPPED_DATA,
  INQUIRY_CHANNEL_ORIG_DATA,
  INQUIRY_FROM_FORM,
  INQUIRY_TO_SAVE,
  INQUIRY_TYPE_MAPPED_DATA,
  INQUIRY_TYPE_ORIG_DATA,
  ORDERS_MAPPED_DATA,
  ORDERS_ORIG_DATA,
  STORE_CHECK_MAPPED_DATA,
  STORE_CHECK_ORIG_DATA,
} from '../../mocks/callTestData';
import * as commonUtils from '../../utils/common';
import {
  callBootstrap,
  createNewInquiry,
  fetchInquiries,
  fetchOrders,
  fetchStoreCheck,
  initialState,
  makeSlice,
  setCallPermissions,
} from './callSlice';

jest.mock('../../api/callApi', () => ({
  fetchCall: jest.fn(),
  fetchCallAttendees: jest.fn(),
  checkIfUserIsOwnerOfCall: jest.fn(),
  fetchOrders: jest.fn(),
  fetchInquiries: jest.fn(),
  fetchStoreCheck: jest.fn(),
  createNewInquiry: jest.fn(),
}));

const METADATA_MOCK = {
  fields: [
    {
      name: 'Inquiry_Type__c',
      picklistValues: INQUIRY_TYPE_ORIG_DATA,
    },
    {
      name: 'InquiryChannel__c',
      picklistValues: INQUIRY_CHANNEL_ORIG_DATA,
    },
  ],
};

describe('callSlice', () => {
  beforeEach(() => {
    callApi.fetchCall.mockReset();
    callApi.fetchCallAttendees.mockReset();
    callApi.checkIfUserIsOwnerOfCall.mockReset();
    callApi.fetchOrders.mockReset();
    callApi.fetchInquiries.mockReset();
    callApi.fetchStoreCheck.mockReset();
    callApi.createNewInquiry.mockReset();
  });

  describe('callBootstrap asyncThunk', () => {
    describe('for non WEB', () => {
      beforeEach(() => {
        metadataBridge.describe.mockReset();
      });

      test('should return call, call attendees and inquiry form data from API if recordId is valid', async () => {
        callApi.fetchCall.mockResolvedValueOnce({ records: [CALL_ORIG_DATA] });
        callApi.fetchCallAttendees.mockResolvedValueOnce({
          records: CALL_ATTENDEES_ORIG_DATA,
        });
        metadataBridge.describe.mockResolvedValueOnce(METADATA_MOCK);

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            callStore: slice.reducer,
          },
        });

        await store.dispatch(callBootstrap('111'));

        expect(callApi.fetchCall).toHaveBeenCalled();
        expect(callApi.fetchCallAttendees).toHaveBeenCalled();
        expect(metadataBridge.describe).toHaveBeenCalled();
        expect(store.getState().callStore.callObj).toEqual(CALL_MAPPED_DATA);
        expect(store.getState().callStore.callAttendees).toEqual(
          CALL_ATTENDEES_MAPPED_DATA
        );
        expect(store.getState().callStore.inquiryFormData).toEqual({
          inquiryTypes: INQUIRY_TYPE_MAPPED_DATA,
          inquiryChannels: INQUIRY_CHANNEL_MAPPED_DATA,
        });
      });

      test('should return ERROR if API returns error', async () => {
        callApi.fetchCall.mockRejectedValueOnce(new Error('Test error'));

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            callStore: slice.reducer,
          },
        });

        await store.dispatch(callBootstrap('111'));

        expect(callApi.fetchCall).toHaveBeenCalled();
        expect(store.getState().callStore.error).toEqual('Rejected');
      });
    });

    describe('for WEB', () => {
      beforeEach(() => {
        sfNetAPI.describe.mockReset();
      });

      test('should return data from API if recordId is valid', async () => {
        commonUtils.isWeb = true;

        callApi.fetchCall.mockResolvedValueOnce({ records: [CALL_ORIG_DATA] });
        callApi.fetchCallAttendees.mockResolvedValueOnce({
          records: CALL_ATTENDEES_ORIG_DATA,
        });
        sfNetAPI.describe.mockResolvedValueOnce(METADATA_MOCK);

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            callStore: slice.reducer,
          },
        });

        await store.dispatch(callBootstrap('111'));

        expect(callApi.fetchCall).toHaveBeenCalled();
        expect(callApi.fetchCallAttendees).toHaveBeenCalled();
        expect(sfNetAPI.describe).toHaveBeenCalled();
        expect(store.getState().callStore.callObj).toEqual(CALL_MAPPED_DATA);
        expect(store.getState().callStore.callAttendees).toEqual(
          CALL_ATTENDEES_MAPPED_DATA
        );
        expect(store.getState().callStore.inquiryFormData).toEqual({
          inquiryTypes: INQUIRY_TYPE_MAPPED_DATA,
          inquiryChannels: INQUIRY_CHANNEL_MAPPED_DATA,
        });
      });
    });
  });

  describe('fetchOrders asyncThunk', () => {
    test('should return orders from API if call object is valid', async () => {
      callApi.fetchOrders.mockResolvedValueOnce({
        records: ORDERS_ORIG_DATA,
        totalSize: ORDERS_ORIG_DATA.length,
      });

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(fetchOrders());

      expect(callApi.fetchOrders).toHaveBeenCalled();
      expect(store.getState().callStore.orders).toEqual({
        data: ORDERS_MAPPED_DATA,
        totalSize: ORDERS_MAPPED_DATA.length,
      });
    });

    test('should return ERROR if API returns error', async () => {
      callApi.fetchOrders.mockRejectedValueOnce(new Error('Test error'));

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(fetchOrders());

      expect(callApi.fetchOrders).toHaveBeenCalled();
      expect(store.getState().callStore.error).toEqual('Rejected');
    });
  });

  describe('fetchInquiries asyncThunk', () => {
    test('should return inquiries from API if call object is valid', async () => {
      callApi.fetchInquiries.mockResolvedValueOnce({
        records: INQUIRIES_ORIG_DATA,
        totalSize: INQUIRIES_ORIG_DATA.length,
      });

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(fetchInquiries());

      expect(callApi.fetchInquiries).toHaveBeenCalled();
      expect(store.getState().callStore.inquiries).toEqual({
        data: INQUIRIES_MAPPED_DATA,
        totalSize: INQUIRIES_MAPPED_DATA.length,
      });
    });

    test('should return ERROR if API returns error', async () => {
      callApi.fetchInquiries.mockRejectedValueOnce(new Error('Test error'));

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(fetchInquiries());

      expect(callApi.fetchInquiries).toHaveBeenCalled();
      expect(store.getState().callStore.error).toEqual('Rejected');
    });
  });

  describe('fetchStoreCheck asyncThunk', () => {
    test('should return store check from API if call object is valid', async () => {
      callApi.fetchStoreCheck.mockResolvedValueOnce({
        records: STORE_CHECK_ORIG_DATA,
        totalSize: STORE_CHECK_ORIG_DATA.length,
      });

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(fetchStoreCheck());

      expect(callApi.fetchStoreCheck).toHaveBeenCalled();
      expect(store.getState().callStore.storeCheck).toEqual({
        data: STORE_CHECK_MAPPED_DATA,
        totalSize: STORE_CHECK_MAPPED_DATA.length,
      });
    });

    test('should return ERROR if API returns error', async () => {
      callApi.fetchStoreCheck.mockRejectedValueOnce(new Error('Test error'));

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(fetchStoreCheck());

      expect(callApi.fetchStoreCheck).toHaveBeenCalled();
      expect(store.getState().callStore.error).toEqual('Rejected');
    });
  });

  describe('setCallPermissions asyncThunk', () => {
    test('should return permissions of creation order, inquiry and store check from API if call object is valid, active user is owner of call and call not submitted', async () => {
      callApi.checkIfUserIsOwnerOfCall.mockResolvedValueOnce({
        records: [{ total: 1 }],
      });

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(setCallPermissions());

      expect(callApi.checkIfUserIsOwnerOfCall).toHaveBeenCalled();
      expect(store.getState().callStore.permissions).toEqual({
        canCreateOrder: true,
        canCreateInquiry: true,
        canCreateStoreCheck: true,
      });
    });

    test('should return ERROR if API returns error', async () => {
      callApi.checkIfUserIsOwnerOfCall.mockRejectedValueOnce(
        new Error('Test error')
      );

      const slice = makeSlice({
        ...initialState,
        callObj: CALL_MAPPED_DATA,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(setCallPermissions());

      expect(callApi.checkIfUserIsOwnerOfCall).toHaveBeenCalled();
      expect(store.getState().callStore.error).toEqual('Rejected');
    });
  });

  describe('createNewInquiry asyncThunk', () => {
    test('should return store check from API if call object is valid', async () => {
      callApi.createNewInquiry.mockResolvedValueOnce('111');

      const slice = makeSlice({
        ...initialState,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(createNewInquiry(INQUIRY_FROM_FORM));

      expect(callApi.createNewInquiry).toHaveBeenCalled();
      expect(callApi.createNewInquiry).toHaveBeenCalledWith(INQUIRY_TO_SAVE);
    });

    test('should return ERROR if API returns error', async () => {
      callApi.createNewInquiry.mockRejectedValueOnce(new Error('Test error'));

      const slice = makeSlice({
        ...initialState,
      });
      const store = configureStore({
        reducer: {
          callStore: slice.reducer,
        },
      });

      await store.dispatch(createNewInquiry(INQUIRY_FROM_FORM));

      expect(callApi.createNewInquiry).toHaveBeenCalled();
      expect(store.getState().callStore.error).toEqual('Rejected');
    });
  });
});
