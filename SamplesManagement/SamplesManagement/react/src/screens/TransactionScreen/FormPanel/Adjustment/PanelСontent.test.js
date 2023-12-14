import React from 'react';
import PanelContent from './PanelContent';
import { Formik } from 'formik';
import { TextInput } from 'apollo-react-native';
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
    const { container } = render(
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
      container.findByType(TextInput).props.onChangeText('test');
    });

    expect(container.findByType(TextInput).props.value).toEqual('test')
  });
});
