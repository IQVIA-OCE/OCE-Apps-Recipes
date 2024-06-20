import React from 'react';
import { DateField } from './DateField';
import { DateTimePicker, Provider } from '@oce-apps/apollo-react-native';
import { render, act } from '@testing-library/react-native';

const date = '2022-11-16T13:46:30.946Z';
const dateMock = new Date(date);

describe('DateField', () => {
  it('should render component', async () => {
    const onChange = jest.fn();

    const { UNSAFE_getByType, getByText } = render(
      <DateField onChange={onChange} label="TestDateField" />
    );

    act(() => {
      UNSAFE_getByType(DateTimePicker).props.actions.done.onPress(
        null,
        dateMock
      );
    });

    expect(onChange).toHaveBeenCalled();
    expect(getByText(/TestDateField/)).toBeTruthy();
  });

  it('toggle DatePicker visibility', () => {
    let { UNSAFE_getByType, getByTestId } = render(
      <Provider>
        <DateField value={date} />
      </Provider>
    );
    const datePickerInput = getByTestId('datePickerInput');
    const datePicker = UNSAFE_getByType(DateTimePicker);

    act(() => {
      datePickerInput.props.onFocus();
    });
    expect(datePicker.props.visible).toEqual(true);

    act(() => {
      datePicker.props.onBackdropPress();
    });
    expect(datePicker.props.visible).toEqual(false);
  });
});
