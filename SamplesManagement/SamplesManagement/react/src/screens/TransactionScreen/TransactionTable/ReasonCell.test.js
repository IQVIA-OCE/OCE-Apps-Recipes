import React from 'react';
import ReasonCell from './ReasonCell';
import { FieldArray, Formik } from 'formik';
import { Select } from 'apollo-react-native';
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
    const { container } = render(
      <Component />
    )

    act(() => {
      container.findByType(Select).props.onChange({ id: '1', label: '1' });
    });

    expect(container.findByType(Select).props.value).toEqual({ id: '1', label: '1' })
  });
});
