import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts, fetchOrderById } from '../api/OrderDetails';
import { environment, localized } from '@oce-apps/oce-apps-bridges';
import mockData from '../utils/mock.json';
import { OrderProductsDeliveries } from "./OrderProductsDeliveries";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    environment: {
        namespace: jest.fn()
    },
    localized: jest.fn()
}))

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../api/OrderDetails', () => ({
    fetchAccounts: jest.fn(),
    fetchOrderById: jest.fn(),
}));

const accounts = [
    {
        Id: '123',
        Name: '321'
    }
]
const dispatch = jest.fn();

describe('App', () => {
    beforeAll(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                orders: {
                    loading: false,
                    orders: mockData,
                    searchProductValue: '',
                    brandOptions: [],
                    _recordId: '123'
                },
                notification: {
                    visible: false
                }
        }));
        fetchAccounts.mockResolvedValue({
            records: accounts
        });
    });
    it('should render default App', async () => {
        const { getByTestId } = render(<OrderProductsDeliveries recordId={''}/>);
        await waitFor(() => {
            expect(getByTestId('filterWrapper').children[0]).toBeTruthy();
            expect(getByTestId('search-view')).toBeTruthy();
            expect(getByTestId("table-container")).toBeTruthy();
            expect(getByTestId("total-qty-scrollview")).toBeTruthy();
            expect(getByTestId("horizontal-scrollview-qty")).toBeTruthy();
        });
    });

    it('render App with recordId of order', async () => {
        environment.namespace.mockResolvedValue('OCE__');
        localized.mockResolvedValue('test');
        const NAMESPACE = environment.namespace();
        fetchOrderById.mockResolvedValue({
            totalSize: 1,
            records: [{
                [`${NAMESPACE}Account__c`]: 321
            }]
        });

        const { getByTestId } = render(<OrderProductsDeliveries recordId={'1'}/>);
        await waitFor(() => {
            expect(getByTestId('filterWrapper').children[0]).toBeTruthy();
            expect(getByTestId('search-view')).toBeTruthy();
            expect(getByTestId("table-container")).toBeTruthy();
            expect(getByTestId("total-qty-scrollview")).toBeTruthy();
            expect(getByTestId("horizontal-scrollview-qty")).toBeTruthy();
        });
    });

    it('render App with recordId of account', async () => {
        localized.mockResolvedValue('test');
        fetchOrderById.mockResolvedValue({
            totalSize: 0,
        });
        const { getByTestId } = render(<OrderProductsDeliveries recordId={'2'}/>);
        await waitFor(() => {
            expect(getByTestId('filterWrapper').children[0]).toBeTruthy();
            expect(getByTestId('search-view')).toBeTruthy();
            expect(getByTestId("table-container")).toBeTruthy();
            expect(getByTestId("total-qty-scrollview")).toBeTruthy();
            expect(getByTestId("horizontal-scrollview-qty")).toBeTruthy();
        });
    });
});
