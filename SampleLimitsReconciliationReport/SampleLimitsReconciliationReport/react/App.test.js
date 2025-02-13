import React from 'react';
import App from './App';
import { render } from '@testing-library/react-native';
import { layoutBridge } from '@oce-apps/oce-apps-bridges'

jest.useFakeTimers();

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  environment: {
    locale: () => '',
    namespace: () => '',
  },
  layoutBridge: {
    setHeight: jest.fn(),
  }
}));


describe('Application', () => {

  it('should not be render on Iphone', () => {
    const { getByText } = render(<App/>);
    expect(getByText('Application is not available for iPhone')).toBeTruthy();
  });

  it('should render properly', () => {
    render(<App instanceId='001' />);
    expect(layoutBridge.setHeight).toHaveBeenCalled();
    expect(layoutBridge.setHeight).toHaveBeenCalledWith(600);
  });

});
