import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from './App';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('./bridge/Logger/logger');

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
  })
});
