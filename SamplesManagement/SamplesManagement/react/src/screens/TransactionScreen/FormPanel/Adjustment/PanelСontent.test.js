import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { TextInput } from '@oce-apps/apollo-react-native';
import { render, act } from '@testing-library/react-native';

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
    )

    expect(getByText(/Comments/)).toBeTruthy();
  });

  it('should call Input onchange', async () => {
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
    )

    act(() => {
      UNSAFE_root.findByType(TextInput).props.onChangeText('test');
    });

    expect(UNSAFE_root.findByType(TextInput).props.value).toEqual('test')
  });
});
