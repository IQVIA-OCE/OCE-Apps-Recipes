import React from 'react';
import CommentsCell from './CommentsCell';
import renderer, { act } from 'react-test-renderer';
import { FieldArray, Formik } from 'formik';
import { TextInput } from 'apollo-react-native';

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
    const tree = renderer.create(<Component />);

    act(() => tree.root.findByType(TextInput).props.onChangeText('some text'));

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
