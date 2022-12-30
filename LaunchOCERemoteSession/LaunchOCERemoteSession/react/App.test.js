import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from './App';

describe('Application', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render properly', () => {
    const tree = renderer.create(
      <App />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
  it('should render with instanceId', () => {
    const tree = renderer.create(
      <App instanceId={'instanceId'}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
  it('should render with instanceId and recordId', async () => {
    const promise = Promise.resolve();
    const tree = renderer.create(
      <App instanceId={'instanceId'} recordId={'recordId'}/>
    ).toJSON();

    await act(() => promise);
    expect(tree).toMatchSnapshot();
  })
});
