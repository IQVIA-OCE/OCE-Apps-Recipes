import React from 'react';
import QuantityCell from './QuantityCell';
import { FieldArray, Formik } from 'formik';
import { TextInput } from 'apollo-react-native';
import { render, act } from '@testing-library/react-native';

const Component = () => (
  <Formik initialValues={{ products: [{ Id: '1', comments: '' }] }}>
    {() => (
      <FieldArray name="products">
        {props => <QuantityCell row={{ Id: '1' }} {...props} />}
      </FieldArray>
    )}
  </Formik>
);

describe('QuantityCell', () => {
  it('should render properly', async () => {
    const { container } = render(
      <Component />
    );

    act(() => {
      container.findByType(TextInput).props.onChangeText('some text');
    });

    expect(container.findByType(TextInput).props.value).toBe('some text');
  });
});
