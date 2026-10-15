import React from 'react';
import PanelContent from './PanelContent';
import { useFormikContext } from 'formik';
import { TextInput } from '@oce-apps/apollo-react-native';
import DateField from '../DateField';
import { render, act, fireEvent } from '@testing-library/react-native';
import moment from 'moment';

jest.mock('formik');

const setFieldValue = jest.fn();
useFormikContext.mockReturnValue({
  values: {
    shipmentCarrier: '',
    comments: '',
    fields: {
      shipmentDate: '',
      trackingNumber: '',
    },
  },
  setFieldValue,
  errors: [],
  touched: false
});

describe('PanelContent', () => {
  beforeEach(() => {
    setFieldValue.mockClear();
  });

  it('should render properly', () => {
    const { getByText } = render(<PanelContent />);
    act(() => jest.runAllTimers());

    expect(getByText(/Tracking Number/)).toBeTruthy();
  });

  it('should call DateField onChange', () => {
    const date = moment().toISOString();
    const { UNSAFE_root } = render(<PanelContent />);
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(DateField), 'change', date);
    act(() => jest.runAllTimers());

    expect(setFieldValue).toHaveBeenCalledWith('fields.shipmentDate', date);
  });

  it('should call TextInputs onChange', () => {
    const { UNSAFE_root } = render(<PanelContent />);
    act(() => jest.runAllTimers());

    const [_, TrackingNumberInput, ShipmentCarrierInput, CommentInput] = UNSAFE_root.findAllByType(TextInput);
    fireEvent.changeText(TrackingNumberInput, 'test');
    expect(setFieldValue).toHaveBeenCalledWith('fields.trackingNumber', 'test');

    setFieldValue.mockClear();
    fireEvent.changeText(ShipmentCarrierInput, 'test');
    expect(setFieldValue).toHaveBeenCalledWith('fields.shipmentCarrier', 'test');

    setFieldValue.mockClear();
    fireEvent.changeText(CommentInput, 'test');
    expect(setFieldValue).toHaveBeenCalledWith('fields.comments', 'test');
  });
});
