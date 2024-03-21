import React from "react";
import { render } from '@testing-library/react-native';
import { App } from './App';
import { layoutBridge } from '@oce-apps/oce-apps-bridges';

describe('Application', () => {
  test('should call setHeight from NativeModules.LayoutBridge if App receive instanceId', () => {
    render(<App instanceId={'00000A1'} />);

    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(600);
  });
});
