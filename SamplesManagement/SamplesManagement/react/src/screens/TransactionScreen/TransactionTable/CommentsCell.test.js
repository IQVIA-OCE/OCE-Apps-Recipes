import React from 'react';
import CommentsCell from './CommentsCell';
import { FieldArray, Formik } from 'formik';
import { TextInput } from 'apollo-react-native';
import { render, act } from '@testing-library/react-native';

describe('CommentsCell', () => {
  it('should render properly', async () => {
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

    const { container } = render(
      <Component />
    )

    act(() => container.findByType(TextInput).props.onChangeText('some text'));

    expect(container.findByType(TextInput).props.value).toBe('some text');

  });
});
