import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { TextInput } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';

describe('PanelContent', () => {
  it('should render properly', () => {
    const { getByText } = render(
      <Formik
        initialValues={{
          fields: {
            comments: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );
    act(() => jest.runAllTimers());

    expect(getByText(/Comments/)).toBeTruthy();
  });

  it('should call Input onchange', () => {
    const { UNSAFE_root } = render(
      <Formik
        initialValues={{
          fields: {
            comments: '',
          },
        }}
      >
        <PanelContent />
      </Formik>
    );
    act(() => jest.runAllTimers());

    fireEvent.changeText(UNSAFE_root.findByType(TextInput), 'test');
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(TextInput).props.value).toEqual('test')
  });
});
