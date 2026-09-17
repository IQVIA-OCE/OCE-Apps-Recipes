import React, { useRef } from 'react'
import { NativeModules } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { useDispatch, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ListRow } from './ListRow'
import { teamMembers } from '../../constants/mockData'
import { initialState, makeSlice } from '../../store/accountSlice/accountSlice'
import * as commonConstants from '../../constants'
import * as helpers from '../../utils/helper'




jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));


const mockUseRef = (obj) => () => Object.defineProperty({}, 'current', {
    get: () => obj,
    set: () => { }
})

const dispatch = jest.fn();


describe('ListRow', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                account: {
                    infoContainerTopPosition: 0,
                    position: {
                        x: 192,
                        y: 200,
                        width: 30,
                        height: 30,
                    },
                    selectedData: teamMembers[0],
                    shouldShowDetailScreen: true,
                    accessLevelOptions: commonConstants.ACCESS_LEVEL_PICKLIST,
                    activeIndex: 3,
                },
            })
        );
        NativeModules.UIManager = { measure: jest.fn() }
    });
    it("should close opened info container and sortoption", async () => {

        const { getByTestId } = render(<ListRow item={teamMembers[0]} index={0} />)
        const touchableWrapper = getByTestId('touchableWrapper_0');
        fireEvent.press(touchableWrapper);

    })
    it("should render ListRow properly", async () => {
        commonConstants.isIphone = false;
        const { getByTestId } = render(<ListRow item={teamMembers[0]} index={0} />)
        expect(getByTestId('touchableWrapper_0')).toBeTruthy();
        expect(getByTestId('userName_0').props.children[0].props.children).toEqual('Partner Admin');
        expect(getByTestId('userName_0').props.children[1].props.children).toEqual(' ');
        expect(getByTestId('territoryName_0').props.children[0].props.children).toEqual('Territory Name');
        expect(getByTestId('territoryName_0').props.children[1].props.children).toEqual('DM - San Francisco 20D02');
        expect(getByTestId('accountAccessLevel_0').props.children[0].props.children).toEqual('Account Access Level');
        expect(getByTestId('accountAccessLevel_0').props.children[1].props.children).toEqual('Read Only');
        expect(getByTestId('phone_0').props.children[0].props.children).toEqual('Phone');
        expect(getByTestId('phone_0').props.children[1].props.children).toEqual('--');
        expect(getByTestId('actionBtn_0')).toBeTruthy();
        expect(getByTestId('detailInfoIcon_0')).toBeTruthy();
    })
    it("should render ListRow properly", async () => {
        commonConstants.isIphone = true;
        const { getByTestId, queryByTestId } = render(<ListRow item={teamMembers[0]} index={0} />)
        expect(getByTestId('touchableWrapper_0')).toBeTruthy();
        expect(getByTestId('userName_0').props.children[0].props.children).toEqual('Partner Admin');
        expect(getByTestId('userName_0').props.children[1].props.children).toEqual(' ');
        expect(getByTestId('territoryName_0').props.children[0].props.children).toEqual('Territory Name');
        expect(getByTestId('territoryName_0').props.children[1].props.children).toEqual('DM - San Francisco 20D02');
        expect(queryByTestId('accountAccessLevel_0')).toBeNull();
        expect(queryByTestId('accountAccessLevel_0')).toBeNull();
        expect(queryByTestId('phone_0')).toBeNull();
        expect(queryByTestId('phone_0')).toBeNull();
        expect(getByTestId('detailInfoIcon_0')).toBeTruthy();
    })
    it("should open infoContainer", async () => {
        commonConstants.isIphone = true;

        const slice = makeSlice({
            ...initialState,
            shouldShowDetailScreen: false,
            maxHeight: 'auto',
            appContainerHeight: 660,
            rowHeight: 88,
            activeIndex: 3
        });

        const store = configureStore({
            reducer: {
                account: slice.reducer,
            },
        });
        const useRef = mockUseRef({ refFunction: jest.fn() })

        const { getByTestId } = render(<ListRow item={teamMembers[0]} index={0} />)
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 100, y: 100 })
        expect(getByTestId('detailInfo_0')).toBeTruthy();
        const infoIcon = getByTestId('detailInfo_0');
        fireEvent.press(infoIcon);
    })
})


