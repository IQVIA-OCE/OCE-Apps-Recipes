import React from 'react';
import ViewAll from './ViewAll';
import { TouchableOpacity } from 'react-native';
import { externalNavigator } from '@oce-apps/oce-apps-bridges';
import { Provider, DarkTheme } from '@oce-apps/apollo-react-native';
import { render, fireEvent } from '@testing-library/react-native';

let onPress = jest.fn();

describe('ViewAll', () => {
  beforeEach(() => {
    externalNavigator.open.mockClear();
  });

  it('Should render ViewAll component and redirect to external url', async () => {
    const { UNSAFE_root } = render(
      <ViewAll url={'{EndPoint}'} />
    )

    fireEvent.press(UNSAFE_root.findByType(TouchableOpacity));

    expect(externalNavigator.open).toHaveBeenCalledTimes(1);
  });

  it('Should render ViewAll component and handle press', async () => {
    const { UNSAFE_root } = render(
      <ViewAll onPress={onPress} />
    );

    fireEvent.press(UNSAFE_root.findByType(TouchableOpacity));

    expect(onPress).toBeCalledTimes(1);
  });

  it('Should render ViewAll component and throw an error', () => {
    const { UNSAFE_root } = render(
      <Provider theme={DarkTheme}>
        <ViewAll url={'{EndPoint}'} />
      </Provider>
    );

    fireEvent.press(UNSAFE_root.findByType(TouchableOpacity));

    expect(externalNavigator.open).toHaveBeenCalledTimes(1);
  });
});
