import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import AccountsFilter from './AccountsFilter';
import { fetchAccounts } from '../../api/OrderDetails';
import useDebounce from '../../utils/useDebounce';
import { Menu, Provider } from '@oce-apps/apollo-react-native';

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

describe("accounts", () => {
    beforeEach(() => {
        jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
    })

    afterEach(() => {
        jest.useRealTimers();
    });

    beforeAll(() => {
        useDebounce.mockImplementation((value) => value);
        fetchAccounts.mockResolvedValue({
            records: accounts
        })
    });

    it("should render", async () => {
        let { UNSAFE_getByType, getByTestId } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        const search = getByTestId('search');
        fireEvent.changeText(search, 'testText');
        const menu = UNSAFE_getByType(Menu);
        fireEvent(search, 'focus');
        await waitFor(() => {
            expect(getByTestId('accountList')).toBeTruthy();
        });
        fireEvent(search, 'blur');
        expect(menu).toBeTruthy();
    });
});
