import React from 'react';
import ReasonCell from './ReasonCell';
import { FieldArray, Formik } from 'formik';
import { Select } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';

const Component = () => (
  <Formik initialValues={{ products: [{ Id: '1', comments: '' }] }}>
    {() => (
      <FieldArray name="products">
        {props => <ReasonCell row={{ Id: '1' }} {...props} />}
      </FieldArray>
    )}
  </Formik>
);

describe('ReasonCell', () => {
  it('should render properly', () => {
    const { UNSAFE_root } = render(
      <Component />
    );
    act(() => jest.runAllTimers());

    fireEvent(UNSAFE_root.findByType(Select), 'change', { id: '1', label: '1' });
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(Select).props.value).toEqual({ id: '1', label: '1' })
  });
});
