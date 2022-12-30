import { render, waitFor, act, fireEvent } from '@testing-library/react-native';
import React from 'react';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts } from './../../api/OrderDetails';
import useDebounce from '../../utils/useDebounce';
import { Provider } from 'apollo-react-native';

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

it('Header with accounts filter', async () => {
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
    const { getByTestId } = render(
        <Provider>
            <Header />
        </Provider>
    );
    const search = getByTestId('search');
    fireEvent(search, 'focus');
    await waitFor(() => {
        expect(getByTestId('accountList')).toBeTruthy();
    });
});