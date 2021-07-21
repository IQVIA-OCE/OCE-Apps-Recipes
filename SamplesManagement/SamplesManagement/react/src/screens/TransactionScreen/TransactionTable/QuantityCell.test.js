import React from 'react';
import renderer, { act } from 'react-test-renderer';
import QuantityCell from './QuantityCell';
import { FieldArray, Formik } from 'formik';
import { TextInput } from 'apollo-react-native';

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
    let tree;
    act(() => {
      tree = renderer.create(<Component />);
    });

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText('some text');
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update(<Component />);
    });

    expect(tree.toJSON()).toMatchSnapshot();
    act(() => {
      tree.update();
    });
  });
});
