import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AccountTeamSortList } from './AccountTeamSortList'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { SORT_OPTION_LIST, LOADING_STATUS } from '../../constants'


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

const dispatch = jest.fn();

describe('AccountTeamSortList', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                sortList: {
                    sortOption: {
                        Id: 1,
                        value: 'userName',
                        label: 'User Name'
                    },
                    sortOrder: 'asc',
                    sortListData: SORT_OPTION_LIST,
                    shouldShowSortList: true,
                },
                account: {
                    loadingStatus: LOADING_STATUS.BOOTSTRAPPING,
                }
            })
        );
    });
    it("should render AccountTeamSortList properly", async () => {
        const { getByTestId, queryByTestId } = render(
            <AccountTeamSortList />)
        const link = getByTestId('sortListLink');
        fireEvent.press(link);
        waitFor(() => expect(queryByTestId('sortList')).toBeTruthy())
        const touchableItem = getByTestId('sortListItem_0');
        await fireEvent.press(touchableItem);
        const tocuchableIcon = getByTestId('sortListIcon');
        await fireEvent.press(tocuchableIcon);
        expect(queryByTestId('sortList')).toBeTruthy()
        expect(getByTestId('sortText').props.children[1]).toEqual('User Name');
    })
    it("should show sort list menu", async () => {
        useSelector.mockImplementation((cb) =>
            cb({
                sortList: {
                    shouldShowSortList: false,
                },
                account: {
                    loadingStatus: LOADING_STATUS.SUCCESS,
                }
            })
        );
        const { getByTestId, queryByTestId } = render(
            <AccountTeamSortList />)
        const link = getByTestId('sortListLink');
        fireEvent.press(link);
    })
})
