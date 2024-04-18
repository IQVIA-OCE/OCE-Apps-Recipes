import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { TextInput } from '@oce-apps/apollo-react-native';
import DateField from '../DateField';
import { render, act } from '@testing-library/react-native';

describe('PanelContent', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <Formik
        initialValues={{
          shipmentCarrier: '',
          comments: '',
          fields: {
            shipmentDate: '',
            trackingNumber: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    )

    expect(getByText(/Tracking Number/)).toBeTruthy();
  });

  it('should call DateField onChange', () => {
    const { UNSAFE_root } = render(
      <Formik
        initialValues={{
          shipmentCarrier: '',
          comments: '',
          fields: {
            shipmentDate: '',
            trackingNumber: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    )

    act(() => {
      UNSAFE_root.findByType(DateField).props.onChange('test');
    });

    expect(UNSAFE_root.findByType(DateField).props.value).toEqual('test');
  });

  it('should call TextInputs onChange', async () => {
    const { UNSAFE_root } = render(
      <Formik
        initialValues={{
          shipmentCarrier: '',
          comments: '',
          fields: {
            shipmentDate: '',
            trackingNumber: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    )

    act(() => {
      UNSAFE_root.findAllByType(TextInput).forEach(el => {
        if (el.props.onChangeText) {
          el.props.onChangeText('test')
        }
      });
    });

    UNSAFE_root.findAllByType(TextInput).forEach(el => {
      if (el.props.onChangeText) {
        expect(el.props.value).toEqual('test');
      }
    });
  });
});
