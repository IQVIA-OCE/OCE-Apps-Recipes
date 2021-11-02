import React from 'react';
import ActionCell from './ActionCell';
import renderer, { act } from 'react-test-renderer';
import { IconButton } from 'apollo-react-native';

describe('ActionCell', () => {
  it('should render properly', async () => {
    const promise = Promise.resolve();
    const onPress = jest.fn();
    const Component = props => <ActionCell {...props} />;

    const tree = renderer.create(
      <Component onPress={onPress} row={{ Id: '1', locked: false }} />
    );

    act(() => tree.root.findByType(IconButton).props.onPress());

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(tree.toJSON()).toMatchSnapshot();

    act(() =>
      tree.update(
        <Component onPress={onPress} row={{ Id: '1', locked: true }} />
      )
    );
    await act(() => promise);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
