import React from 'react';
import renderer, { act } from 'react-test-renderer';
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

  it('Should render ViewAll component and redirect to external url', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(<ViewAll url={'{EndPoint}'} />);

    act(() => tree.root.findByType(TouchableOpacity).props.onPress());

    await act(() => promise);
    expect(open.mock.calls.length).toBe(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('Should render ViewAll component and handle press', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(<ViewAll onPress={onPress} />);

    act(() => tree.root.findByType(TouchableOpacity).props.onPress());

    await act(() => promise);
    expect(onPress).toBeCalledTimes(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});

describe('ViewAll', () => {
  beforeEach(() => {
    open = jest
      .fn()
      .mockRejectedValueOnce('custom error text');
    NativeModules.ExternalNavigatorBridge = { open };
  });

  it('Should render ViewAll component and throw an error', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(<ViewAll url={'{EndPoint}'} />);

    await tree.root.findByType(TouchableOpacity).props.onPress();

    await act(() => promise);
    expect(open.mock.calls.length).toBe(1);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
