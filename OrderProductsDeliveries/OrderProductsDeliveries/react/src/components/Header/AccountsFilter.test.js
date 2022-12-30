import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import AccountsFilter from './AccountsFilter';
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

describe("accounts", () => {
    beforeAll(() => {
        useDebounce.mockImplementation((value) => value);
        fetchAccounts.mockResolvedValue({
            records: accounts
        })
    });

    it("should render", async () => {
        let { getByTestId } = render(
            <Provider>
                <AccountsFilter />
            </Provider>
        );
        const search = getByTestId('search');
        fireEvent.changeText(search, 'testText');
        await waitFor(() => fetchAccounts);
        const menu = getByTestId('menu');
        fireEvent(search, 'focus');
        fireEvent(search, 'blur');
        expect(menu).not.toBeNull();
    });
});