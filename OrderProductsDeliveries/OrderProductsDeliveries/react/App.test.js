import { render, waitFor } from '@testing-library/react-native';
import React from 'react';
import App from './App';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAccounts } from './src/api/OrderDetails';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('./src/api/OrderDetails', () => ({
    fetchAccounts: jest.fn(),
}));

const accounts = [
    {
        Id: '123',
        Name: '321'
    }
]

it('App', async () => {
    useDispatch.mockReturnValue(() => jest.fn());
    fetchAccounts.mockResolvedValue({
        records: accounts
    })
    useSelector.mockImplementation((cb) => cb({
        ordersListReducers: {
            searchProductValue: '',
            brandOptions: [],
            _recordId: '123'
        },
        notification: {}
    }));
    const { container, toJSON } = render(<App />);
    await waitFor(() => fetchAccounts);
    expect(toJSON(container)).toMatchSnapshot();
})