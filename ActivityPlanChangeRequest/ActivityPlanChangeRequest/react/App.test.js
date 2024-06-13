import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';
import RN from 'react-native';
jest.mock('./src/constants/namespacePrefix', () => ({ NAMESPACE: 'OCE__' }));

jest.mock('@oce-apps/oce-apps-bridges', () => ({
  sfNetAPI: {
    enablePromises: jest.fn(),
    query: jest.fn()
  }
}));

describe('App', () => {
  it('should render correctly', () => {
    const tree = render(
      <App />
    )
  })

  it('should render with dark theme', () => {
    const mock = jest.fn();

    jest.spyOn(RN, 'useColorScheme').mockImplementation(mock);

    mock.mockReturnValueOnce('dark');

    const tree = render(
      <App />
    )
  })
})
