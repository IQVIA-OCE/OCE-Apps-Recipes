import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Select } from '@oce-apps/apollo-react-native'
import { useDispatch, useSelector } from 'react-redux';
import { render, fireEvent, act } from '@testing-library/react-native'
import { AccordianContent } from './AccordianContent'
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
    it("should render AccordianContent  properly", async () => {
        const { getByTestId } = render(<AccordianContent />)
        expect(getByTestId('accordianContent')).toBeTruthy();

    })
    it("should render AccordianContent  properly without any input values", async () => {
        const { getByPlaceholderText } = render(<AccordianContent />)
        fireEvent.changeText(getByPlaceholderText(/User Name/i));
    })
    it("should render AccordianContent  properly with username value", async () => {
        const { getByPlaceholderText } = render(<AccordianContent />)
        fireEvent.changeText(getByPlaceholderText(/User Name/i), 'Admin');
    })
    it("should render AccordianContent  properly with territory name value", async () => {
        const { getByPlaceholderText } = render(<AccordianContent />)
        fireEvent.changeText(getByPlaceholderText(/Territory Name/i), 'Aurora');
    })
    it("should render AccordianContent  properly with phone number", async () => {
        const { getByPlaceholderText } = render(<AccordianContent />)
        fireEvent.changeText(getByPlaceholderText(/Phone/i), '480');
    })
    it("should render AccordianContent  properly with account access level", async () => {

        const { UNSAFE_getByType } = render(<AccordianContent />)
        UNSAFE_getByType(Select).props.onChange({ label: 'Read', value: 'Read' })
    })
    it("should click on filter apply button", async () => {

        const { getByText } = render(<AccordianContent />)
        fireEvent.press(getByText(/Apply/i));
    })
    it("should click on filter clear button", async () => {

        const { getByText } = render(<AccordianContent />)
        fireEvent.press(getByText(/Clear/i));
    })

})


