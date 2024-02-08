import React from 'react';
import App from './App';
import RN from 'react-native';
import { render } from '@testing-library/react-native';

jest.mock('./src/constants/constants', () => ({
  NAMESPACE: 'OCE__',
}));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn(),
    query: jest.fn()
  },
  environment: {
    locale: () => '',
    namespace: () => '',
    territory: () => '',
    userId: () => '',
    userID: () => '',
  },
  layoutBridge: {
    setHeight: jest.fn()
  }
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

describe('Application', () => {
  it('should render properly', () => {
    render(<App />);
    jest.runAllTimers();
  });

  it('should render properly with dark theme', () => {
    jest.spyOn(RN, 'useColorScheme').mockReturnValueOnce('dark');

    render(<App />);
    jest.runAllTimers();
  })
});
