import React from 'react';
import App from './App';
import { render } from '@testing-library/react-native';
import {DarkTheme, Provider} from "@oce-apps/apollo-react-native";
import { Appearance } from 'react-native'
import { layoutBridge } from "@oce-apps/oce-apps-bridges";

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  environment: {
    namespace: jest.fn()
  },
  layoutBridge: {
    setHeight: jest.fn()
  },
  localized: jest.fn()
}))

describe('Application', () => {
  it('should render properly', () => {
    const tree = render(
        <App />
    )
    expect(tree).toBeTruthy();
    expect(layoutBridge.setHeight).not.toHaveBeenCalled();
  })
  it('should render with instanceId', () => {
    Appearance.getColorScheme = () => 'dark';
    const tree = render(
        <Provider theme={DarkTheme}>
          <App instanceId={'instanceId'}/>
        </Provider>
    );
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(460, 'instanceId');
    expect(tree).toBeTruthy();
  })
  it('should render with instanceId and recordId', () => {
    const tree = render(
        <App instanceId={'instanceId'} recordId={'recordId'}/>
    )

    expect(layoutBridge.setHeight).toHaveBeenCalledWith(400, 'instanceId');
    expect(tree).toBeTruthy();
  })
});
