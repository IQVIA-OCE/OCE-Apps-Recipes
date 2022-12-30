import React from 'react';
import { render } from '@testing-library/react-native';
import { layoutBridge } from 'oce-apps-bridges'
import App from './App';


jest.useFakeTimers();

jest.mock('oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn()
  },
  environment: {
    locale: () => '',
    namespace: () => '',
    territory: () => '',
    userId: () => '',
  }
}));


describe('Application', () => {
  beforeEach(() => {
    Platform = require('react-native').Platform;
  });
  it('should render correctly', () => {
    const rendered = render(
      <App />
    );

    expect(rendered).toBeTruthy();
  });
});
