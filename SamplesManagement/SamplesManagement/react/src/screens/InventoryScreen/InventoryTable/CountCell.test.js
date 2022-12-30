import React from 'react';
import renderer, { act } from 'react-test-renderer';
import CountCell from './CountCell';
import { Formik } from 'formik';
import { TextInput } from 'apollo-react-native';

const Component = () => (
  <Formik
    initialValues={{ id: '123', status: 'Saved', products: [{ id: '1', physicalQuantity: 2 }] }}
  >
    <CountCell row={{ id: '1' }} />
  </Formik>
);

describe('CountCell', () => {
  it('should render properly', async () => {
    let tree;
    act(() => {
      tree = renderer.create(<Component />);
    });

    act(() => {
      tree.root.findByType(TextInput).props.onChangeText('1');
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
