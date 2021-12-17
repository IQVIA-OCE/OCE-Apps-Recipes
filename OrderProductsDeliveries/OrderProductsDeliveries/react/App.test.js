import { render } from '@testing-library/react-native';
import React from 'react';
import App from './App';
import { useSelector, useDispatch } from 'react-redux';
import * as localization from './bridge/Localization/localization.native';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

it('App', () => {
    localization.localized = jest.fn();
    useDispatch.mockReturnValue(() => jest.fn());
    useSelector.mockImplementation((cb) => cb({
        ordersListReducers: {
            _recordType: 'Order',
            searchProductValue: '',
            brandOptions: [],
            _recordId: '123'
        },
        notification: {}
    }));
    render(<App />);
})