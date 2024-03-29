import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { render, act, fireEvent } from '@testing-library/react-native'
import { PopOverView } from './PopOverView'
import { SORT_OPTION_LIST } from '../../constants'
import * as commonConstants from '../../constants'
import * as helpers from '../../utils/helper'
import { getRectForRef } from "../../utils/helper";

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('../../utils/helper', () => ({
    getRectForRef: jest.fn(),
    calcRightPosition: jest.fn(),
    calcTopPostion: jest.fn()
}));

const mockUseRef = (obj) => () => Object.defineProperty({}, 'current', {
    get: () => obj,
    set: () => { }
})

const dispatch = jest.fn();

describe('PopOverView', () => {
    beforeEach(() => {
        getRectForRef.mockReturnValue({height: 0});
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
        const { getByTestId } = render(<PopOverView ref={useRef} />);
        const infoArrow = getByTestId('info-arrow');
        act(() => {
            fireEvent(infoArrow, 'layout', {
                nativeEvent: {
                    layout: {
                        width: 15,
                        height: 15,
                        x: 391,
                        y: 19
                    }
                },
            });
        });
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 100, y: 50, height: 18, width: 18 })
        expect(getByTestId('popOverView')).toBeTruthy();

    })

    it("should render PopOverView properly with when it taps on rows in bottom position", async () => {
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 100, y: 200, height: 18, width: 18 })
        useSelector.mockImplementation((cb) =>
            cb({
                account: {
                    position: {
                        x: 300, y: 100, width: 200, height: 300
                    },
                    selectedData: SORT_OPTION_LIST[0],
                    appContainerHeight: 800
                },
            })
        );
        const useRef = mockUseRef({ refFunction: jest.fn() })
        const { getByTestId } = render(
            <PopOverView ref={useRef} />)
        const infoArrow = getByTestId('info-arrow');
        act(() => {
            fireEvent(infoArrow, 'layout', {
                nativeEvent: {
                    layout: {
                        width: 15,
                        height: 15,
                        x: 391,
                        y: 19
                    }
                },
            });
        });
        expect(getByTestId('popOverView')).toBeTruthy();

    })
    it("should render PopOverView properly in lowest position", async () => {
        useSelector.mockImplementation((cb) =>
            cb({
                account: {
                    position: {
                        x: 300, y: 700, width: 200, height: 100
                    },
                    selectedData: SORT_OPTION_LIST[0],
                    appContainerHeight: 580
                },
            })
        );
        const useRef = mockUseRef({ refFunction: jest.fn() })
        const { getByTestId } = render(
            <PopOverView ref={useRef} />)
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 400, y: 450 })
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 600, y: 100 })
        expect(getByTestId('popOverView')).toBeTruthy();

    })
    it("should render PopOverView properly with smaller in web", async () => {
        useSelector.mockImplementation((cb) =>
            cb({
                account: {
                    position: {
                        x: 100, y: 200, width: 200, height: 300
                    },
                    selectedData: SORT_OPTION_LIST[0],
                    appContainerHeight: 580,
                    activeIndex: 1
                },
            })
        );
        const useRef = mockUseRef({ refFunction: jest.fn() })
        const { getByTestId } = render(
            <PopOverView ref={useRef} />)
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 400, y: 450 })
        jest.spyOn(helpers, 'getRectForRef').mockImplementation(useRef).mockResolvedValue({ x: 600, y: 300 })
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
