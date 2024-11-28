import React from 'react'
import { AccountTeamSearchInput } from './AccountTeamSearchInput'
import { render, fireEvent } from '@testing-library/react-native'

describe('AccountTeamSearchInput', () => {
    it("should render AccountTeamSearchInput properly", async () => {
        const onSearch = jest.fn();
        const { getByPlaceholderText } = render(
            <AccountTeamSearchInput onSearch={onSearch} />)
        expect(getByPlaceholderText(/Search/i)).toBeTruthy();
        fireEvent.changeText(getByPlaceholderText(/Search/i), 'Admin');
        expect(onSearch).toHaveBeenCalledTimes(1);
        expect(onSearch).toHaveBeenCalledWith('Admin');

    })
})