import React from 'react';
import QuantityCell from './QuantityCell';
import { FieldArray, Formik } from 'formik';
import { TextInput } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';

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
  it('should render properly', () => {
    const { UNSAFE_root } = render(
      <Component />
    );
    act(() => jest.runAllTimers());

    fireEvent.changeText(UNSAFE_root.findByType(TextInput), 'some text');
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(TextInput).props.value).toBe('some text');
  });
});
