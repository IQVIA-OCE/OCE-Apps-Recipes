import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { render, fireEvent, act } from '@testing-library/react-native'
import { AccordianiPhoneContent } from './AccordianiPhoneContent'
import { ACCESS_LEVEL_PICKLIST } from '../../constants'

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
}));

jest.mock('@oce-apps/apollo-react-native/lib/module/components/PressableRipple', () =>
    jest.fn(({ children }) => children)
);


const dispatch = jest.fn();

describe('Header', () => {
    beforeEach(() => {
        jest.useFakeTimers();
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
                    filterCount: 0
                },
                account: {
                    accessLevelOptions: ACCESS_LEVEL_PICKLIST
                }
            })
        );
    });
    afterEach(() => {
        jest.useRealTimers();
    })
    it("should render AccordianiPhoneContent  properly in small screens", async () => {
        const { getByTestId } = render(<AccordianiPhoneContent />)
        expect(getByTestId('accordianiPhoneContent')).toBeTruthy();

    })
    it("should render AccordianiPhoneContent  properly without any input values", async () => {
        const { getByPlaceholderText } = render(<AccordianiPhoneContent />)
        fireEvent.changeText(getByPlaceholderText(/User Name/i));
        act(() => {
            jest.runAllTimers();
        });
    })
    it("should render AccordianiPhoneContent  properly with username value", async () => {
        const { getByPlaceholderText } = render(<AccordianiPhoneContent />)
        fireEvent.changeText(getByPlaceholderText(/User Name/i), 'Admin');
        act(() => {
            jest.runAllTimers();
        });
    })
    it("should render AccordianiPhoneContent  properly with territory name value", async () => {
        const { getByPlaceholderText } = render(<AccordianiPhoneContent />)
        fireEvent.changeText(getByPlaceholderText(/Territory Name/i), 'Aurora');
        act(() => {
            jest.runAllTimers();
        });
    })
    it("should render AccordianiPhoneContent  properly with phone number", async () => {
        const { getByPlaceholderText } = render(<AccordianiPhoneContent />)
        fireEvent.changeText(getByPlaceholderText(/Phone/i), '480');
        act(() => {
            jest.runAllTimers();
        });
    })
    it("should click on filter apply button in iPhone", async () => {
        const { getByText } = render(<AccordianiPhoneContent />)
        fireEvent.press(getByText(/Apply/i));
    })
    it("should click on filter clear button in iPhone", async () => {

        const { getByText } = render(<AccordianiPhoneContent />)
        fireEvent.press(getByText(/Clear/i));
    })
})


