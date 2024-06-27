import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import React from 'react';
import AccountsFilter from './AccountsFilter';
import { fetchAccounts } from '../../api/ordersApi';
import useDebounce from '../../utils/useDebounce';
import { Menu, Provider } from '@oce-apps/apollo-react-native';
import { fetchOrdersList, setAccountName, setAccountId } from '../../store/orders/ordersSlice';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../../api/ordersApi', () => ({
    fetchAccounts: jest.fn(),
}));

jest.mock('../../store/orders/ordersSlice', () => ({
    fetchOrdersList: jest.fn(),
    setAccountName: jest.fn(),
    setAccountId: jest.fn()
}));

jest.mock('../../utils/useDebounce');

const accounts = [
    {
        Id: '123',
        Name: '321'
    }
]

const dispatch = jest.fn();

describe("accounts", () => {
    beforeAll(() => {
        useDebounce.mockImplementation((value) => value);
        useDispatch.mockImplementation(() => dispatch);
        fetchAccounts.mockResolvedValue({
            records: accounts
        })
    });

    beforeEach(() => {
        jest.useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("should successfully focus input", () => {
        let { getByTestId } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        const search = getByTestId('search');
        act(() => {
            fireEvent(search, 'focus');
            fireEvent.changeText(search, 'testText');
        })
        expect(search.props.value).toEqual('testText');
    });
    it('should successfully onIconPress', () => {
        let { UNSAFE_getByProps, getByTestId } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        const input = getByTestId('search');
        act(() => {
            fireEvent.changeText(input, 'test');
        })
        const icon = UNSAFE_getByProps({ source: 'close' });
        fireEvent.press(icon);
        expect(fetchOrdersList).toHaveBeenCalled();
        expect(setAccountName).toHaveBeenCalledWith(null);
        expect(setAccountId).toHaveBeenCalledWith(null);
    });
    it('should successfully press on MenuItem', async () => {
        let { getByTestId, getByText } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        await waitFor(() => {
            const input = getByTestId('search');
            fireEvent(input, 'focus');
            fireEvent.changeText(input, 'test');
            const menuItem = getByText('321');
            fireEvent(menuItem, 'onPress', { nativeEvent: {} });
            expect(setAccountId).toHaveBeenCalledWith("123");
        });
    });
});
