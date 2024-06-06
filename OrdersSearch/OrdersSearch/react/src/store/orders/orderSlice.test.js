import { fetchAccountName, ordersSliceReducer, fetchOrdersList, setAccountId, setAccountName, setPageType, setError } from "./ordersSlice";
import * as orderApi from "../../api/ordersApi";
import { configureStore } from '@reduxjs/toolkit';
import { LOADING_STATUS, PAGE_TYPE } from "../../utils/constants";
import { filtersSliceReducer } from "../filters/filtersSlice";
import { mockEmptyStore } from "../../mock";

jest.mock('../../api/ordersApi', () => ({
    fetchAllOrders: jest.fn(),
    fetchAccount: jest.fn(),
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    sfNetAPI: {
      describe: jest.fn(),
      metadata: jest.fn(),
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
        locale: () => 'en_US',
    },
    databaseManager: {
        fetch: jest.fn()
    },
    localized: jest.fn()
}));

const makeStore = (_initialState = {}) => {
    return configureStore({
      reducer: {
        orders: ordersSliceReducer,
        filters: filtersSliceReducer
      },
      preloadedState: {
        orders: _initialState.orders,
        filters: _initialState.filters
      },
    });
  };

  describe('OrderSlice', () => {

    let store;

      beforeEach(() => {
        store = makeStore(mockEmptyStore);
      });
    describe('fetchAccount', () => {
        it('should call api fetchAccount', async () => {
            orderApi.fetchAccount.mockResolvedValueOnce({
                records: [{
                    Name: 'title'
                }]
            });
            const result = await store.dispatch(fetchAccountName());
            expect(result.payload).toEqual('title')
        });
        it('should call api fetchAccount with error', async () => {
            orderApi.fetchAccount.mockRejectedValue('error');
            const result = await store.dispatch(fetchAccountName());
            expect(result.error.message).toEqual('Rejected')
            expect(result.payload).toEqual('error')
        });
    });

    describe('fetchAllOrders', () => {
        it('should call api fetchAllOrders', async () => {
            orderApi.fetchAllOrders.mockResolvedValueOnce([{
                    Order_Name: 'title'
                }]
            );
            const result = await store.dispatch(fetchOrdersList());
            expect(result.payload[0].Order_Name).toEqual('title')
        });
        it('should call api fetchAllOrders with error', async () => {
            orderApi.fetchAllOrders.mockRejectedValue('error');
            const result = await store.dispatch(fetchOrdersList());
            expect(result.payload).toEqual('error')
        });
    });
    it('should dispatch setAccountId', async () => {
        await store.dispatch(setAccountId('123'));
        expect(store.getState().orders.account.id).toEqual('123')
    });
    it('should dispatch setAccountName', async () => {
        await store.dispatch(setAccountName('testTitle'));
        expect(store.getState().orders.account.name).toEqual('testTitle')
    });
    it('should dispatch setPageType', async () => {
        await store.dispatch(setPageType(PAGE_TYPE.HOME));
        expect(store.getState().orders.pageType).toEqual(PAGE_TYPE.HOME)
    });
    it('should dispatch setError', async () => {
        await store.dispatch(setError('error'));
        expect(store.getState().orders.error).toEqual('error')
    });
  });
