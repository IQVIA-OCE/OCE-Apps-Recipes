import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {
    Search,
} from '@oce-apps/apollo-react-native';
import { render, fireEvent } from '@testing-library/react-native'
import { Header } from './Header'
import { SORT_OPTION_LIST } from '../../constants/mockData'
import * as commonConstants from '../../constants'


jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

const dispatch = jest.fn();

describe('Header', () => {
    beforeEach(() => {
        useDispatch.mockImplementation(() => dispatch);
        useSelector.mockImplementation((cb) =>
            cb({
                sortList: {
                    sortOption: null,
                    sortOrder: 'asc',
                    sortListData: SORT_OPTION_LIST,
                },
                account: {
                    loadingStatus: commonConstants.LOADING_STATUS.BOOTSTRAPPING,
                }
            })
        );
    });
    it("should render Header  properly", async () => {
        const { getByTestId, UNSAFE_getByType } = render(<Header />)
        expect(getByTestId('header')).toBeTruthy();
        fireEvent.changeText(UNSAFE_getByType(Search), 'Admin');
    })
    it("should render Header in iPhone  properly", async () => {
        commonConstants.isIphone = false;
        const { getByTestId, UNSAFE_getByType } = render(<Header />)
        expect(getByTestId('header')).toBeTruthy();
        fireEvent.changeText(UNSAFE_getByType(Search), 'Admin');
    })
    it("should open filter menu", async () => {
        commonConstants.isIphone = false;
        const { getByTestId } = render(<Header />)
        fireEvent.press(getByTestId('accordianView'));
    })
    it("should open filter menu in iPhone", async () => {
        commonConstants.isIphone = true;
        const { getByTestId } = render(<Header />)
        fireEvent.press(getByTestId('accordianView'));
    })

})

