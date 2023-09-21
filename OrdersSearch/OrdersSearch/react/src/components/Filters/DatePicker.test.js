import React from 'react';
import { fireEvent, render } from "@testing-library/react-native";
import { DateTimePicker, IconButton, TextInput } from "apollo-react-native";
import { DatePicker } from "./DatePicker";
import { formatDate } from '../../utils';
import { TouchableOpacity } from 'react-native';

jest.mock('oce-apps-bridges', () => ({
    sfNetAPI: {
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
    },
}));

const dateExample = '2022-11-16T13:46:30.946Z';

describe('DatePicker', () => {
    it('should render date in input', () => {
        let { getByTestId } = render(<DatePicker date={dateExample}/>);
        const textInput = getByTestId('datepickerInput');
        expect(textInput.props.value).toEqual(formatDate(dateExample));
    });

    it('should make visible Datepicker when textinput focused', () => {
        const setDatePickerVisibility = jest.fn((cb) => cb());
        let { getByTestId } = render(<DatePicker date={dateExample} setDatePickerVisibility={setDatePickerVisibility}/>);
        const textInput = getByTestId('datepickerInput');
        textInput.props.onFocus();
        expect(setDatePickerVisibility).toBeCalled();
    });

    it('should hide Datepicker when IconPress', () => {
        const setDatePickerVisibility = jest.fn((cb) => cb());
        let { container } = render(<DatePicker date={dateExample} setDatePickerVisibility={setDatePickerVisibility}/>);
        const iconButton = container.findAllByType(TouchableOpacity)[0];
        fireEvent(iconButton, 'press')
        expect(setDatePickerVisibility).toBeCalled();
    });

    it('should hide Datepicker when backdropPress', () => {
        const setDatePickerVisibility = jest.fn((cb) => cb());
        let { container } = render(<DatePicker date={dateExample} setDatePickerVisibility={setDatePickerVisibility}/>);
        const picker = container.findAllByType(DateTimePicker).find(item => item._fiber.pendingProps.testID === 'datepicker');
        picker._fiber.pendingProps.onBackdropPress();
        expect(setDatePickerVisibility).toBeCalled();
    });
});