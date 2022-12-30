import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { render, waitFor } from '@testing-library/react-native'
import { PopOverView } from './PopOverView'
import { SORT_OPTION_LIST } from '../../constants'
import * as commonConstants from '../../constants'
import * as helpers from '../../utils/helper'

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));
jest.mock("react-native", () => {
    const RN = jest.requireActual("react-native");

    RN.UIManager.getViewManagerConfig = name => {
        return {};
    };

    Object.defineProperty(RN, "findNodeHandle", {
        get: jest.fn(() => () => 1),
        set: jest.fn()
    });

    return RN;
});

const mockUseRef = (obj) => () => Object.defineProperty({}, 'current', {
    get: () => obj,
    set: () => { }
})

const dispatch = jest.fn();

describe('PopOverView', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                account: {
                    position: {
                        x: 300, y: 200, width: 200, height: 300
                    },
                    selectedData: SORT_OPTION_LIST[0],
                    appContainerHeight: 800
                },
            })
        );
    });
    it("should render PopOverView properly with normal view", async () => {
        const useRef = mockUseRef({ refFunction: jest.fn() })
        const { getByTestId } = render(
            <PopOverView ref={useRef} />)
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 100, y: 300 })
        expect(getByTestId('popOverView')).toBeTruthy();

    })
    it("should render PopOverView properly with smaller in web", async () => {
        const useRef = mockUseRef({ refFunction: jest.fn() })
        const { getByTestId } = render(
            <PopOverView ref={useRef} />)
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 400, y: 450 })
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 600, y: 100 })
        expect(getByTestId('popOverView')).toBeTruthy();

    })
    it("should render PopOverView properly with smaller screen", async () => {
        const useRef = mockUseRef({ refFunction: jest.fn() })
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                account: {
                    position: {
                        x: 300, y: 150, width: 200, height: 300
                    },
                    selectedData: SORT_OPTION_LIST[0],
                    appContainerHeight: 300
                },
            })
        );
        const { getByTestId } = render(
            <PopOverView ref={useRef} />)
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 100, y: 100 })
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 600, y: 100 })
        expect(getByTestId('popOverView')).toBeTruthy();

    })
    it("should render PopOverView properly in iPhone", () => {
        commonConstants.isIphone = false;
        const { getByTestId } = render(
            <PopOverView />)
        expect(getByTestId('popOverView')).toBeTruthy();

    })
})