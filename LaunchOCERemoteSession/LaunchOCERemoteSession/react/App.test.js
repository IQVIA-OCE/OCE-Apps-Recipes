import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

jest.mock("./bridge/Localization/localization.native.js");

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
  it('should render with instanceId and recordId', () => {
    const tree = renderer.create(
      <App instanceId={'instanceId'} recordId={'recordId'}/>
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
});
