import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
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
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) => cb({
        ordersListReducers: {
            _recordId: '111',
            searchProductValue: '',
            brandOptions: []
        }
    }));
    const { container, toJSON } = render(<Header />);
    expect(toJSON(container)).toMatchSnapshot();
})

it('Header with acoounts filter', async () => {
    useDebounce.mockImplementation((value) => value);
    fetchAccounts.mockResolvedValue({
        records: accounts
    })
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) => cb({
        ordersListReducers: {
            _recordId: null,
            searchProductValue: '',
            brandOptions: []
        }
    }));

    const { container, toJSON } = render(<Header />);
    await waitFor(() => fetchAccounts);
    expect(toJSON(container)).toMatchSnapshot();
})