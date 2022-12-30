import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from './App';
import RN from 'react-native';
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Application', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <App />
    ).toJSON();

    await act(() => promise);
    expect(tree).toMatchSnapshot();
  });

  it('should render properly with dark theme', async () => {
    const promise = Promise.resolve();

    const mock = jest.fn();

    jest.spyOn(RN, 'useColorScheme').mockImplementation(mock);

    mock.mockReturnValueOnce('dark');

    const tree = renderer.create(
      <App />
    ).toJSON();

    await act(() => promise);
    expect(tree).toMatchSnapshot();
  })
});
