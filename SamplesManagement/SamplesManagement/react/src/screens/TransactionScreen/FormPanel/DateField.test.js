import React from 'react';
import DateField from './DateField';
import { DateTimePicker } from 'apollo-react-native';
import { useBoolean } from '../../../hooks';
import { render, act } from '@testing-library/react-native';

jest.mock('../../../hooks');

describe('DateField', () => {
  beforeEach(() => {
    useBoolean.mockReturnValue([
      false,
      { toggle: jest.fn(), setFalse: jest.fn(), setTrue: jest.fn() },
    ]);
  });

  it('should render component', async () => {
    const onChange = jest.fn();

    const { container, getByText } = render(
      <DateField onChange={onChange} label="TestDateField"/>
    )

    act( () => {
      container.findByType(DateTimePicker).props.actions.done.onPress();
    });

    expect(onChange).toHaveBeenCalled();
    expect(getByText(/TestDateField/)).toBeTruthy();
  });
});
