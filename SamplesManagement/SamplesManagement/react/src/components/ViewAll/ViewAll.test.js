import React from 'react';
import renderer from 'react-test-renderer';
import ViewAll from './ViewAll';
import { TouchableOpacity } from 'react-native';
import { NativeModules } from 'react-native';

let open;
let onPress = jest.fn()

describe('ViewAll', () => {
  beforeEach(() => {
    open = jest
      .fn()
      .mockResolvedValueOnce('URL')
    NativeModules.ExternalNavigatorBridge = { open };
  });

  it('Should render ViewAll component and redirect to external url', () => {
    const tree = renderer.create(<ViewAll url={'{EndPoint}'} />);

    tree.root.findByType(TouchableOpacity).props.onPress();

    expect(open.mock.calls.length).toBe(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render ViewAll component and handle press', () => {
    const tree = renderer.create(<ViewAll onPress={onPress} />);

    tree.root.findByType(TouchableOpacity).props.onPress();

    expect(onPress).toBeCalledTimes(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('ViewAll', () => {
  beforeEach(() => {
    open = jest
      .fn()
      .mockRejectedValueOnce(new Error('Async error'));
    NativeModules.ExternalNavigatorBridge = { open };
  });

  it('Should render ViewAll component and throw an error', async () => {
    const tree = renderer.create(<ViewAll url={'{EndPoint}'} />);

    await tree.root.findByType(TouchableOpacity).props.onPress();

    expect(open.mock.calls.length).toBe(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});