import React from 'react';
import DateField from './DateField';
import { DateTimePicker } from '@oce-apps/apollo-react-native';
import { useBoolean } from '../../../hooks';
import { render, act } from '@testing-library/react-native';

jest.mock('../../../hooks/useBoolean');

describe('DateField', () => {
  beforeEach(() => {
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });

  it('should render component', () => {
    const onChange = jest.fn();

    const { UNSAFE_root, getByText } = render(
      <DateField onChange={onChange} label="TestDateField"/>
    );
    act(() => jest.runAllTimers());

    act( () => {
      UNSAFE_root.findByType(DateTimePicker).props.actions.done.onPress();
    });
    act(() => jest.runAllTimers());

    expect(onChange).toHaveBeenCalled();
    expect(getByText(/TestDateField/)).toBeTruthy();
  });
});
