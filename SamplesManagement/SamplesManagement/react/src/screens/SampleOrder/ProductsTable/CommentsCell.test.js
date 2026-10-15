import React from 'react';
import CommentsCell from './CommentsCell';
import { FieldArray, Formik } from 'formik';
import { TextInput } from '@oce-apps/apollo-react-native';
import { render, act, fireEvent } from '@testing-library/react-native';

describe('CommentsCell', () => {
  it('should render properly', () => {
    const form = { products: [{ Id: '1', comments: '' }] };
    const Component = props => (
      <Formik initialValues={form}>
        {() => (
          <FieldArray name="products">
            {props => <CommentsCell row={{ Id: '1' }} {...props} />}
          </FieldArray>
        )}
      </Formik>
    );

    const { UNSAFE_root } = render(<Component />);

    fireEvent.changeText(UNSAFE_root.findByType(TextInput), 'some text');
    act(() => jest.runAllTimers());

    expect(UNSAFE_root.findByType(TextInput).props.value).toBe('some text');
  });
});
