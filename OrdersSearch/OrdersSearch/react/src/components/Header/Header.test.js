
import React from 'react';
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import Header from './Header';
import { useDispatch, useSelector } from 'react-redux';
import { LOADING_STATUS, PAGE_TYPE } from '../../utils/constants';
import useDebounce from '../../utils/useDebounce';
import { fetchAccounts } from '../../api/ordersApi';
import { mockState } from '../../mock';

jest.mock('../../utils/useDebounce');

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../api/ordersApi', () => ({
    fetchAccounts: jest.fn(),
}));

jest.mock('../../store/filters/filtersSlice', () => ({
    clearFilters: jest.fn(),
    setFilter: jest.fn(),
    fetchBrandsList: jest.fn(),
    fetchDeliveryPickList: jest.fn(), 
    fetchOrderPickList: jest.fn(),
}));

jest.mock('oce-apps-bridges', () => ({
    sfNetAPI: {
      describe: jest.fn(),
      metadata: jest.fn(),
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
    },
    databaseManager: {
        fetch: jest.fn()
    },
    localized: jest.fn()
}));

const dispatch = jest.fn();

const accounts = [
    {
        Id: '123',
        Name: '321'
    }
]
describe('Header', () => {

    beforeAll(() => {
        useDebounce.mockImplementation((value) => value);
        fetchAccounts.mockResolvedValue({
            records: accounts
        })
    });

    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) => cb({
                ...mockState
            })
        );
    })

    it('should render Header on Home page', async () => {
        useSelector.mockImplementation((cb) => cb({
                ...mockState,
                orders: {
                    ...mockState.orders,
                    pageType: PAGE_TYPE.HOME,
                    account: {
                        ...mockState.orders.account,
                        loadingStatus: LOADING_STATUS.PENDING
                    }
                }
            })
        );
        let { getByTestId } = render(<Header />);
        await waitFor(() => {
            const accountFilterWrapper = getByTestId('accountFilterWrapper');
            expect(accountFilterWrapper).toBeTruthy()
        });
    });

    it('should set expanded Filter', () => {
        let { getByTestId } = render(<Header />);
        const touchable = getByTestId('accordionTouchable');
        fireEvent.press(touchable);
        const apply = getByTestId('applyButton');
        expect(apply).toBeTruthy()
    });
});