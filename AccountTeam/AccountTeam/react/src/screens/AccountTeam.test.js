import React from 'react'
import { NativeModules } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from '@oce-apps/apollo-react-native';
import { AccountTeam } from './AccountTeam'
import { render, fireEvent, act } from '@testing-library/react-native'
import { SORT_OPTION_LIST } from '../constants'
import * as commonConstants from '../constants'
import {getRectForRef} from "../utils/helper";

jest.useFakeTimers();

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));

jest.mock('../utils/helper', () => ({
    getRectForRef: jest.fn(),
    calcRightPosition: jest.fn(),
    calcTopPostion: jest.fn()
}));

const dispatch = jest.fn();

NativeModules.ReachabilityBridge = {
    networkReachabilityStatus: jest.fn()
        .mockResolvedValueOnce('ONLINE')
        .mockRejectedValue('ERROR')
}

describe('AccountTeam', () => {
    beforeEach(() => {
        getRectForRef.mockReturnValue({height: 0});
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
                    filterCount: 0
                },
                account: {
                    shouldShowDetailScreen: true,
                    params: {
                        searchQuery: 'test'
                    },
                    position: {
                        x: 0,
                        y: 0,
                        width: 0,
                        height: 0,
                    },
                }
            })
        );
    });
    it("should render AccountTeam properly", () => {
        commonConstants.isIphone = false;
        const { getByTestId } = render(
            <AccountTeam />
        )
        expect(getByTestId('accountTeamComponent')).toBeTruthy();
    })
    it("should render AccountTeam properly in iPhone", () => {
        commonConstants.isIphone = true;
        const { getByTestId } = render(
            <AccountTeam />
        )
        act(() => {
            fireEvent(getByTestId('accountTeamComponent'), 'layout', {
                nativeEvent: { layout: { height: 100 } },
            });
        });
        expect(getByTestId('accountTeamComponent')).toBeTruthy();
    })
    it("should render AccountTeam properly without network", () => {
        const { ReachabilityBridge } = NativeModules;
        jest.spyOn(ReachabilityBridge, "networkReachabilityStatus").mockImplementation(() => Promise.resolve('No Connection'));
        const { getByTestId } = render(
            <AccountTeam />
        )
        expect(getByTestId('accountTeamComponent')).toBeTruthy();
    })
    it("should close active popups if click on any where in the screen", () => {
        const { getByTestId } = render(
            <AccountTeam />
        )
        const touchableItem = getByTestId('dismissPopup');
        fireEvent.press(touchableItem);

    })
    it("should close error banner", () => {
        const { UNSAFE_queryAllByType } = render(
            <AccountTeam />
        )
        const iconButtons = UNSAFE_queryAllByType(IconButton);
        fireEvent.press(iconButtons[0]);
        fireEvent.press(iconButtons[1]);

    })
})



