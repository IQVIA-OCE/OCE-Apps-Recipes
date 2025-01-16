import { configureStore } from '@reduxjs/toolkit';
import { metadataBridge, sfNetAPI } from '@oce-apps/oce-apps-bridges';
import { PAGE } from '../../constants';
import * as commonUtils from '../../utils/common';
import { identifyPage, initialState, makeSlice } from './settingsSlice';

describe('settingsSlice', () => {
  describe('for non WEB', () => {
    beforeEach(() => {
      metadataBridge.describe.mockReset();
    });

    describe('identifyPage asyncThunk', () => {
      test('should return page type CALL if recordId is valid or page type is supported', async () => {
        metadataBridge.describe.mockResolvedValueOnce({ keyPrefix: 'A01' });
        metadataBridge.describe.mockResolvedValueOnce({ keyPrefix: 'B02' });

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            settingsStore: slice.reducer,
          },
        });

        await store.dispatch(identifyPage('A01NT111'));

        expect(metadataBridge.describe).toHaveBeenCalled();
        expect(metadataBridge.describe.mock.calls.length).toEqual(2);
        expect(store.getState().settingsStore.page).toEqual(PAGE.CALL);
      });

      test('should return page type MEETING if recordId is valid or page type is supported', async () => {
        metadataBridge.describe.mockResolvedValueOnce({ keyPrefix: 'A01' });
        metadataBridge.describe.mockResolvedValueOnce({ keyPrefix: 'B02' });

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            settingsStore: slice.reducer,
          },
        });

        await store.dispatch(identifyPage('B02NT111'));

        expect(metadataBridge.describe).toHaveBeenCalled();
        expect(metadataBridge.describe.mock.calls.length).toEqual(2);
        expect(store.getState().settingsStore.page).toEqual(PAGE.MEETING);
      });

      test('should return ERROR if recordId is valid and page type is unsupported', async () => {
        metadataBridge.describe.mockResolvedValueOnce({ keyPrefix: 'A01' });
        metadataBridge.describe.mockResolvedValueOnce({ keyPrefix: 'B02' });

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            settingsStore: slice.reducer,
          },
        });

        await store.dispatch(identifyPage('TATNT111'));

        expect(metadataBridge.describe).toHaveBeenCalled();
        expect(metadataBridge.describe.mock.calls.length).toEqual(2);
        expect(store.getState().settingsStore.error).toEqual('Rejected');
      });

      test('should return ERROR if recordId is invalid', async () => {
        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            settingsStore: slice.reducer,
          },
        });

        await store.dispatch(identifyPage(null));

        expect(metadataBridge.describe).not.toHaveBeenCalled();
        expect(store.getState().settingsStore.error).toEqual('Rejected');
      });
    });
  });

  describe('for WEB', () => {
    beforeEach(() => {
      sfNetAPI.metadata.mockReset();
    });

    describe('identifyPage asyncThunk', () => {
      test('should return page type CALL if recordId is valid or page type is supported', async () => {
        commonUtils.isWeb = true;

        sfNetAPI.metadata.mockResolvedValueOnce({
          objectDescribe: { keyPrefix: 'A01' },
        });
        sfNetAPI.metadata.mockResolvedValueOnce({
          objectDescribe: { keyPrefix: 'B02' },
        });

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            settingsStore: slice.reducer,
          },
        });

        await store.dispatch(identifyPage('A01NT111'));

        expect(sfNetAPI.metadata).toHaveBeenCalled();
        expect(sfNetAPI.metadata.mock.calls.length).toEqual(2);
        expect(store.getState().settingsStore.page).toEqual(PAGE.CALL);
      });

      test('should return page type MEETING if recordId is valid or page type is supported', async () => {
        commonUtils.isWeb = true;

        sfNetAPI.metadata.mockResolvedValueOnce({
          objectDescribe: { keyPrefix: 'A01' },
        });
        sfNetAPI.metadata.mockResolvedValueOnce({
          objectDescribe: { keyPrefix: 'B02' },
        });

        const slice = makeSlice({
          ...initialState,
        });
        const store = configureStore({
          reducer: {
            settingsStore: slice.reducer,
          },
        });

        await store.dispatch(identifyPage('B02NT111'));

        expect(sfNetAPI.metadata).toHaveBeenCalled();
        expect(sfNetAPI.metadata.mock.calls.length).toEqual(2);
        expect(store.getState().settingsStore.page).toEqual(PAGE.MEETING);
      });
    });
  });
});
