import React from 'react';
import ActionCell from './ActionCell';
import renderer, { act } from 'react-test-renderer';
import { IconButton } from 'apollo-react-native';
import { Formik } from 'formik';

describe('ActionCell', () => {
  it('should render properly', () => {
    const onPress = jest.fn();
    const Component = props => (
      <Formik initialValues={{ products: [{ lotNumberId: '1' }] }}>
        <ActionCell {...props} />
      </Formik>
    );

    const tree = renderer.create(
      <Component onPress={onPress} row={{ lotNumberId: '1', locked: false }} />
    );

    act(() => tree.root.findByType(IconButton).props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(tree.toJSON()).toMatchSnapshot();

    act(() =>
      tree.update(
        <Component onPress={onPress} row={{ Id: '1', locked: true }} />
      )
    );

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
