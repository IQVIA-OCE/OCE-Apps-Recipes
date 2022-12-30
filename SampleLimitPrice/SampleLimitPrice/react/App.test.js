import React from 'react';
import renderer from 'react-test-renderer';
import { Appearance } from "react-native";
import App from './App';
import * as commonConstants from './src/constants';

jest.useFakeTimers();
describe('Application', () => {
  it('should render properly', () => {
    commonConstants.isIphone = true;
    const instanceId = '556E3984-FA45-4594-B13E-FCE318926540';
    const tree = renderer.create(
      <App instanceId={instanceId} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
  it('should render properly in dark mode', () => {
    Appearance.getColorScheme = () => 'dark';
    commonConstants.isIphone = true;
    const instanceId = '556E3984-FA45-4594-B13E-FCE318926540';
    const tree = renderer.create(
      <App instanceId={instanceId} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
  it('application should render properly on iPhone', () => {
    commonConstants.isIphone = false;
    const instanceId = '556E3984-FA45-4594-B13E-FCE318926540';
    const tree = renderer.create(
      <App instanceId={instanceId} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  })
});
