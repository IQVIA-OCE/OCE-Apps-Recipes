import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import AccountsFilter from './AccountsFilter';
import { fetchAccounts } from '../../api/ordersApi';
import useDebounce from '../../utils/useDebounce';
import { Menu, Provider } from 'apollo-react-native';
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

    it("should successfully focus input", async () => {
        let { container, getByTestId } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        const search = getByTestId('search');
        const menu = container.findByProps({ testID: 'menu' });
        fireEvent(search, 'focus');
        fireEvent.changeText(search, 'testText');
        await waitFor(() => {
            expect(menu._fiber.pendingProps.visible).toBeTruthy();
            expect(menu._fiber.pendingProps.anchor.props.value).toEqual('testText');
        });
    });
    it('should successfully onIconPress', async () => {
        let { container } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        await waitFor(() => {
            const search = container.findByProps({ testID: 'search' });
            search._fiber.pendingProps.onIconPress();
            expect(fetchOrdersList).toHaveBeenCalled();
            expect(setAccountName).toHaveBeenCalledWith(null);
            expect(setAccountId).toHaveBeenCalledWith(null);
        });
    });
    it('should successfully press on MenuItem', async () => {
        let { container } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        await waitFor(() => {
            const search = container.findByProps({ testID: 'search' });
            fireEvent(search, 'focus');
            const menuItem = container.findByProps({ testID: 'menu-item-123' });
            fireEvent(menuItem, 'press');
            expect(setAccountId).toHaveBeenCalledWith("123");
        });
    });
});