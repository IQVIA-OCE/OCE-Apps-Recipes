import React from 'react';
import ViewAll from './ViewAll';
import { TouchableOpacity } from 'react-native';
import { externalNavigator } from '@oce-apps/oce-apps-bridges';
import { Provider, DarkTheme } from '@oce-apps/apollo-react-native';
import { render, act } from '@testing-library/react-native';

let onPress = jest.fn();

describe('ViewAll', () => {
  beforeEach(() => {
    externalNavigator.open = jest.fn()
  });

  it('Should render ViewAll component and redirect to external url', async () => {
    const { UNSAFE_root } = render(
      <ViewAll url={'{EndPoint}'} />
    )

    act(() => UNSAFE_root.findByType(TouchableOpacity).props.onPress());

    expect(externalNavigator.open.mock.calls.length).toBe(1);
  });

  it('Should render ViewAll component and handle press', async () => {
    const { UNSAFE_root } = render(
      <ViewAll onPress={onPress} />
    );

    act(() => UNSAFE_root.findByType(TouchableOpacity).props.onPress());

    expect(onPress).toBeCalledTimes(1);
  });
});

describe('ViewAll', () => {
  it('Should render ViewAll component and throw an error', async () => {
    const { UNSAFE_root } = render(
      <Provider theme={DarkTheme}>
        <ViewAll url={'{EndPoint}'} />
      </Provider>
    );

    await UNSAFE_root.findByType(TouchableOpacity).props.onPress();

    expect(externalNavigator.open.mock.calls.length).toBe(1);
  });
});
