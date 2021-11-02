import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import * as localization from '../../../bridge/Localization/localization.native';
import { fetchAccounts } from './../../api/OrderDetails';
import useDebounce from '../../utils/useDebounce';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('./../../api/OrderDetails', () => ({
    fetchAccounts: jest.fn(),
}));

jest.mock('../../utils/useDebounce');

const accounts = [
    {
        Id: '123',
        Name: '321'
    }
]

it('Header', () => {
    localization.localized = jest.fn();
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) => cb({
        ordersListReducers: {
            _recordType: 'Order',
            searchProductValue: '',
            brandOptions: []
        }
    }));
    render(<Header />);
})

it('Header with acoounts filter', async () => {
    useDebounce.mockImplementation((value) => value);
    fetchAccounts.mockResolvedValue({
        records: accounts
    })
    localization.localized = jest.fn();
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) => cb({
        ordersListReducers: {
            _recordType: null,
            searchProductValue: '',
            brandOptions: []
        }
    }));

    render(<Header />);
    await waitFor(() => fetchAccounts);
})