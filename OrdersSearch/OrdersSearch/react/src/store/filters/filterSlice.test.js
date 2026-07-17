import { fetchBrandsList, fetchOrderPickList, fetchDeliveryPickList, setFilter, setSearchedAccount, clearFilters, setErrorFilters } from "./filtersSlice";
import * as orderApi from "../../api/ordersApi";
import * as picklistApi from "../../api/picklistStatusApi";
import { configureStore } from '@reduxjs/toolkit';
import { ORDER_NAME } from "../../utils/constants";
import { filtersSliceReducer } from "../filters/filtersSlice";
import { ordersSliceReducer } from "../orders/ordersSlice";
import { mockEmptyStore } from "../../mock";
import { waitFor } from '@testing-library/react-native';

jest.mock('../../api/ordersApi', () => ({
    fetchOrders: jest.fn(),
    fetchAccount: jest.fn(),
    fetchBrands: jest.fn(),
    fetchParentProductIds: jest.fn()
}));

jest.mock('../../api/picklistStatusApi', () => ({
    fetchOrderPickListValues: jest.fn(),
    fetchDeliveryPickListValues: jest.fn(),
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
    describe('fetchParentProductIds', () => {
        it('should call api fetchParentProductIds', async () => {
            orderApi.fetchParentProductIds.mockResolvedValueOnce({
                records: [{
                    OCE__ParentBrandProductId__c: 'testId'
                },
                {
                    OCE__ParentBrandProductId__c: 'testId2'
                }],
                done: true,
                queryLocator: null
            });
            orderApi.fetchBrands.mockResolvedValueOnce({
                records: [{
                    Name: 'test-name',
                    Id: 'test-id'
                },
                {
                    Name: 'test-name2',
                    Id: 'test-id2'
                }],
                done: true,
                queryLocator: null
            });
            const result = await store.dispatch(fetchBrandsList());
            expect(orderApi.fetchBrands).toHaveBeenCalledWith("testId','testId2", null);
            expect(result.payload).toEqual([{
                label: 'test-name',
                value: 'test-id'
            },
            {
                label: 'test-name2',
                value: 'test-id2'
            }])
        });
        it('should call api fetchAccount with error', async () => {
            orderApi.fetchParentProductIds.mockResolvedValueOnce({
                records: [{
                    OCE__ParentBrandProductId__c: 'testId'
                },
                {
                    OCE__ParentBrandProductId__c: 'testId2'
                }]
            });
            orderApi.fetchBrands.mockRejectedValue('error');
            const result = await store.dispatch(fetchBrandsList());
            expect(result.error.message).toEqual('Rejected')
            expect(result.payload).toEqual('error')
        });
    });

    describe('fetchOrderPicklist', () => {
        it('should call api fetchOrderPicklist', async () => {
            picklistApi.fetchOrderPickListValues.mockResolvedValueOnce([{label: 'test', value: 'test'}]);
            const result = await store.dispatch(fetchOrderPickList());
            expect(result.payload[0].label).toEqual('test')
        });
        it('should call api fetchAccount with error', async () => {
            picklistApi.fetchOrderPickListValues.mockRejectedValue('error');
            const result = await store.dispatch(fetchOrderPickList());
            expect(result.error.message).toEqual('Rejected')
            expect(result.payload).toEqual('error')
        });
    });

    describe('fetchDeliveryPicklist', () => {
        it('should call api fetchDeliveryPicklist', async () => {
            picklistApi.fetchDeliveryPickListValues.mockResolvedValueOnce([{label: 'test', value: 'test'}]);
            const result = await store.dispatch(fetchDeliveryPickList());
            expect(result.payload[0].label).toEqual('test')
        });
        it('should call api fetchAccount with error', async () => {
            picklistApi.fetchDeliveryPickListValues.mockRejectedValue('error');
            const result = await store.dispatch(fetchDeliveryPickList());
            expect(result.error.message).toEqual('Rejected')
            expect(result.payload).toEqual('error')
        });
    });

    it('should dispatch setFilter', async () => {
        await store.dispatch(setFilter({ key: ORDER_NAME, value: 'title' }));
        expect(store.getState().filters.values.orderName).toEqual('title')
    });
    it('should dispatch setSearchedAccount', async () => {
        await store.dispatch(setSearchedAccount({ name: 'name', id: 'testid' }));
        expect(store.getState().filters.account.name).toEqual('name')
        expect(store.getState().filters.account.id).toEqual('testid')
    });
    it('should dispatch clearFilters', async () => {
        await store.dispatch(setSearchedAccount({ name: 'name', id: 'testid' }));
        await store.dispatch(clearFilters());
        expect(store.getState().filters.filterCount).toEqual(0)
    });
    it('should dispatch setErrorFilters', async () => {
        await store.dispatch(setErrorFilters('error'));
        expect(store.getState().filters.error).toEqual('error')
    });
  });
