import React from 'react';
import App from './App';
import { render } from '@testing-library/react-native';
import { layoutBridge } from 'oce-apps-bridges';

describe('Application', () => {

  it('should render correctly', () => {
    const { getByTestId } = render(<App/>);

    expect(getByTestId('loader-wrap')).toBeTruthy();
    expect(layoutBridge.setHeight).not.toHaveBeenCalled();
  });

  it('should render correctly', () => {
    render(<App instanceId='001'/>);

    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(600);
  });
});
