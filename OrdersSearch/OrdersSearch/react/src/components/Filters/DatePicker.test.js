import React from 'react';
import { fireEvent, render } from "@testing-library/react-native";
import { DateTimePicker, IconButton, TextInput } from "@oce-apps/apollo-react-native";
import { DatePicker } from "./DatePicker";
import { formatDate } from '../../utils';
import { TouchableOpacity } from 'react-native';
import { Pressable } from 'react-native';

jest.mock('@oce-apps/oce-apps-bridges', () => ({
    sfNetAPI: {
      enablePromises: jest.fn()
    },
    environment: {
        namespace: () => 'OCE__',
        locale: () => 'en_US',
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
        let { UNSAFE_getAllByType } = render(<DatePicker date={dateExample} setDatePickerVisibility={setDatePickerVisibility}/>);
        const iconButton = UNSAFE_getAllByType(Pressable)[0];
        fireEvent(iconButton, 'press')
        expect(setDatePickerVisibility).toBeCalled();
    });

    it('should hide Datepicker when backdropPress', () => {
        const setDatePickerVisibility = jest.fn((cb) => cb());
        let { UNSAFE_getAllByType } = render(<DatePicker date={dateExample} setDatePickerVisibility={setDatePickerVisibility}/>);
        const picker = UNSAFE_getAllByType(DateTimePicker).find(item => item._fiber.pendingProps.testID === 'datepicker');
        picker._fiber.pendingProps.onBackdropPress();
        expect(setDatePickerVisibility).toBeCalled();
    });
});
