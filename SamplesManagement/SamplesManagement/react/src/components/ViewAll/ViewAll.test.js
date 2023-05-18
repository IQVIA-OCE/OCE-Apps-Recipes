import React from 'react';
import ViewAll from './ViewAll';
import { TouchableOpacity } from 'react-native';
import { externalNavigator } from 'oce-apps-bridges';
import { Provider, DarkTheme } from 'apollo-react-native';
import { render, act } from '@testing-library/react-native';

let onPress = jest.fn();

describe('ViewAll', () => {
  beforeEach(() => {
    externalNavigator.open = jest.fn()
  });

  it('Should render ViewAll component and redirect to external url', async () => {
    const { container } = render(
      <ViewAll url={'{EndPoint}'} />
    )

    act(() => container.findByType(TouchableOpacity).props.onPress());

    expect(externalNavigator.open.mock.calls.length).toBe(1);
  });

  it('Should render ViewAll component and handle press', async () => {
    const { container } = render(
      <ViewAll onPress={onPress} />
    );

    act(() => container.findByType(TouchableOpacity).props.onPress());

    expect(onPress).toBeCalledTimes(1);
  });
});

describe('ViewAll', () => {
  it('Should render ViewAll component and throw an error', async () => {
    const { container } = render(
      <Provider theme={DarkTheme}>
        <ViewAll url={'{EndPoint}'} />
      </Provider>
    );

    await container.findByType(TouchableOpacity).props.onPress();

    expect(externalNavigator.open.mock.calls.length).toBe(1);
  });
});
