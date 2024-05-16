import React from 'react';
import ReasonCell from './ReasonCell';
import { FieldArray, Formik } from 'formik';
import { Select } from '@oce-apps/apollo-react-native';
import { render, act } from '@testing-library/react-native';

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
  it('should render properly', async () => {
    const { UNSAFE_root } = render(
      <Component />
    )

    act(() => {
      UNSAFE_root.findByType(Select).props.onChange({ id: '1', label: '1' });
    });

    expect(UNSAFE_root.findByType(Select).props.value).toEqual({ id: '1', label: '1' })
  });
});
